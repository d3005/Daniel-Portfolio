import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import SectionHeader from './SectionHeader';

interface Certification {
  id: string;
  name: string;
  organization: string;
  date: string;
  description: string;
  credentialUrl?: string;
  skills: string[];
}

const certifications: Certification[] = [
  {
    id: '1',
    name: 'GenAI Engineer Internship',
    organization: 'QWATCH Digital Security',
    date: '2025',
    description: 'Comprehensive training in Generative AI, LLM development, and RAG pipeline implementation for enterprise security applications.',
    skills: ['LLM Development', 'RAG', 'Prompt Engineering', 'Security AI']
  },
  {
    id: '2',
    name: 'AWS Academy Graduate',
    organization: 'Amazon Web Services / EduSkills',
    date: '2024',
    description: 'Cloud computing fundamentals, AWS services, and deployment strategies for scalable ML applications.',
    skills: ['AWS', 'Cloud Computing', 'EC2', 'S3', 'SageMaker']
  },
  {
    id: '3',
    name: 'Deep Learning Specialization',
    organization: 'SmartInternz',
    date: '2024',
    description: 'Advanced neural networks, CNNs, RNNs, and transformer architectures with hands-on projects.',
    skills: ['Deep Learning', 'Neural Networks', 'CNN', 'Transformers']
  },
  {
    id: '4',
    name: 'Machine Learning Internship',
    organization: 'Next24Tech',
    date: '2024',
    description: 'Practical ML implementation including NLP pipelines, classification systems, and API deployment.',
    skills: ['Machine Learning', 'NLP', 'API Development', 'Model Deployment']
  },
  {
    id: '5',
    name: 'Data Science Internship',
    organization: 'Prodigy InfoTech',
    date: '2024',
    description: 'Data analysis, visualization, and statistical modeling with Python and relevant libraries.',
    skills: ['Data Science', 'Pandas', 'NumPy', 'Data Visualization']
  }
];

export default function CertificationsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="certifications" className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/50 to-dark-950/80 pointer-events-none" />
      
      <div className="container-custom relative z-10" ref={ref}>
        <SectionHeader
          title="Certifications & Credentials"
          subtitle="Industry-recognized certifications validating my expertise in AI, ML, and Cloud technologies"
        />

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-6 relative group overflow-hidden"
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-accent-cyan/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              <div className="relative z-10">
                {/* Icon and Date */}
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-primary-500/20 flex items-center justify-center"
                  >
                    <Award size={28} className="text-accent-cyan" />
                  </motion.div>
                  
                  <div className="flex items-center gap-1 text-sm text-dark-400">
                    <Calendar size={14} />
                    <span>{cert.date}</span>
                  </div>
                </div>

                {/* Certification Name */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors">
                  {cert.name}
                </h3>
                
                {/* Organization */}
                <p className="text-sm text-dark-400 mb-3">
                  {cert.organization}
                </p>

                {/* Description */}
                <p className="text-sm text-dark-500 mb-4 leading-relaxed">
                  {cert.description}
                </p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs rounded-full bg-dark-800 text-dark-300 border border-dark-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Verification Badge */}
                <div className="flex items-center gap-2 text-sm text-accent-green">
                  <CheckCircle size={16} />
                  <span>Verified Credential</span>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent-cyan/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-dark-700/50"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Certifications', value: '5+' },
              { label: 'Organizations', value: '5' },
              { label: 'Skills Validated', value: '20+' },
              { label: 'Completion Rate', value: '100%' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-4"
              >
                <div className="text-3xl font-bold text-accent-cyan mb-1">{stat.value}</div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-accent-purple/5 rounded-full blur-3xl" />
    </section>
  );
}