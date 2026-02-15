import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Github, 
  Star, 
  GitFork, 
  Users, 
  BookOpen, 
  Code2,
  ExternalLink,
  Loader2,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

interface GitHubStats {
  public_repos: number;
  followers: number;
  following: number;
  total_stars: number;
  total_forks: number;
  top_languages: { [key: string]: number };
  pinned_repos: Array<{
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
  }>;
}

function useGitHubStats(username: string) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();

        // Fetch all repos
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!reposResponse.ok) throw new Error('Failed to fetch repos');
        const repos = await reposResponse.json();

        // Calculate total stars and forks
        const totalStars = repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
        const totalForks = repos.reduce((acc: number, repo: any) => acc + repo.forks_count, 0);

        // Calculate language stats
        const languageStats: { [key: string]: number } = {};
        repos.forEach((repo: any) => {
          if (repo.language) {
            languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
          }
        });

        // Sort repos by stars and get top 6
        const topRepos = repos
          .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6)
          .map((repo: any) => ({
            name: repo.name,
            description: repo.description || 'No description available',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language || 'N/A',
            url: repo.html_url
          }));

        setStats({
          public_repos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          total_stars: totalStars,
          total_forks: totalForks,
          top_languages: languageStats,
          pinned_repos: topRepos
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, [username]);

  return { stats, loading, error };
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  delay: number;
}

function StatCard({ icon: Icon, label, value, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-6 relative group overflow-hidden"
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />
      
      <div className="flex items-start justify-between">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} bg-opacity-20`}
        >
          <Icon size={24} className="text-white" />
        </motion.div>
        
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
          className="text-3xl font-bold text-white"
        >
          {value.toLocaleString()}
        </motion.span>
      </div>
      
      <p className="text-dark-400 text-sm mt-3">{label}</p>
    </motion.div>
  );
}

export default function GitHubStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { stats, loading, error } = useGitHubStats('d3005');

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={40} className="text-accent-cyan" />
        </motion.div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 text-center"
      >
        <Github size={48} className="text-dark-500 mx-auto mb-4" />
        <p className="text-dark-400">Unable to load GitHub stats at the moment.</p>
        <a
          href="https://github.com/d3005"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-accent-cyan hover:underline"
        >
          <span>View GitHub Profile</span>
          <ExternalLink size={16} />
        </a>
      </motion.div>
    );
  }

  const sortedLanguages = Object.entries(stats.top_languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="mt-20 pt-16 border-t border-accent-cyan/20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h2 className="heading-2 mb-4">
          <span className="gradient-text">GitHub Stats</span>
        </h2>
        <p className="text-dark-400 text-lg max-w-2xl mx-auto">
          Live statistics from my GitHub profile showcasing my open-source contributions
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard
          icon={BookOpen}
          label="Public Repos"
          value={stats.public_repos}
          color="from-primary-500 to-accent-purple"
          delay={0.3}
        />
        <StatCard
          icon={Star}
          label="Total Stars"
          value={stats.total_stars}
          color="from-accent-yellow to-accent-orange"
          delay={0.4}
        />
        <StatCard
          icon={GitFork}
          label="Total Forks"
          value={stats.total_forks}
          color="from-accent-green to-accent-cyan"
          delay={0.5}
        />
        <StatCard
          icon={Users}
          label="Followers"
          value={stats.followers}
          color="from-accent-pink to-accent-purple"
          delay={0.6}
        />
      </div>

      {/* Languages & Top Repos Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Top Languages */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Code2 size={24} className="text-accent-cyan" />
            <h3 className="text-xl font-bold text-white">Top Languages</h3>
          </div>
          
          <div className="space-y-4">
            {sortedLanguages.map(([lang, count], index) => (
              <motion.div
                key={lang}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="text-sm font-medium text-dark-200 w-24">{lang}</span>
                <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { 
                      width: `${(count / Math.max(...Object.values(stats.top_languages))) * 100}%` 
                    } : {}}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-cyan rounded-full"
                  />
                </div>
                <span className="text-sm text-dark-400 w-12 text-right">{count}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contribution Highlights */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={24} className="text-accent-green" />
            <h3 className="text-xl font-bold text-white">Highlights</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { icon: Award, text: `${stats.public_repos} public repositories`, color: "text-accent-yellow" },
              { icon: Star, text: `${formatNumber(stats.total_stars)} total stars earned`, color: "text-accent-orange" },
              { icon: GitFork, text: `${formatNumber(stats.total_forks)} total forks`, color: "text-accent-green" },
              { icon: Zap, text: "Active contributor to open source", color: "text-accent-cyan" },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <item.icon size={20} className={item.color} />
                <span className="text-dark-300">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Repositories */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Top Repositories</h3>
          <motion.a
            href="https://github.com/d3005?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-sm text-accent-cyan hover:underline"
          >
            <span>View All</span>
            <ExternalLink size={14} />
          </motion.a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.pinned_repos.map((repo, index) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-5 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-white group-hover:text-accent-cyan transition-colors line-clamp-1">
                  {repo.name}
                </h4>
                <ExternalLink size={16} className="text-dark-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <p className="text-sm text-dark-400 mb-4 line-clamp-2 h-10">
                {repo.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-accent-cyan font-medium">
                  {repo.language}
                </span>
                
                <div className="flex items-center gap-3 text-sm text-dark-400">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-accent-yellow" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={14} className="text-accent-green" />
                    {repo.forks}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* GitHub Profile CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1 }}
        className="text-center mt-12"
      >
        <motion.a
          href="https://github.com/d3005"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-dark-800 border border-dark-700 hover:border-accent-cyan hover:bg-dark-800/80 transition-all group"
        >
          <Github size={24} className="text-white" />
          <span className="text-white font-semibold">View Full GitHub Profile</span>
          <ExternalLink size={18} className="text-accent-cyan group-hover:translate-x-1 transition-transform" />
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
