export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  image: string;
  resume: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  stats: {
    internships: number;
    projects: number;
    certifications: number;
  };
}

export interface Skill {
  id: string;
  icon: string;
  title: string;
  description: string;
  technologies: string[];
  color: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string[];
  type: 'work' | 'internship';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  demo?: string;
  metrics?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  grade: string;
  icon: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  icon: string;
  link?: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
}
