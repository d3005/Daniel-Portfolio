import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'person' | 'website' | 'project';
  data?: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    // Remove any existing structured data scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    let structuredData: any = {};

    switch (type) {
      case 'person':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Daniel Joseph Kommu',
          jobTitle: 'GenAI & Machine Learning Engineer',
          description: 'GenAI-focused Machine Learning Engineer with experience building scalable AI systems, NLP pipelines, RAG architectures, and LLM-based solutions.',
          url: 'https://www.daniel-portfolio.in',
          image: 'https://www.daniel-portfolio.in/portfolio.jpeg',
          email: 'dannyjoseph3007@outlook.com',
          telephone: '+91-9390217611',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Vijayawada',
            addressRegion: 'Andhra Pradesh',
            addressCountry: 'India'
          },
          alumniOf: {
            '@type': 'EducationalOrganization',
            name: 'Rise Krishna Sai Prakasam Group of Institutions',
            description: 'B.Tech in Computer Science with Data Science Specialization'
          },
          worksFor: {
            '@type': 'Organization',
            name: 'Available for Opportunities'
          },
          sameAs: [
            'https://github.com/d3005',
            'https://linkedin.com/in/daniel-joseph-kommu'
          ],
          knowsAbout: [
            'Generative AI',
            'Large Language Models',
            'RAG Pipelines',
            'Machine Learning',
            'Deep Learning',
            'Natural Language Processing',
            'Computer Vision',
            'Python',
            'TensorFlow',
            'PyTorch'
          ],
          hasOccupation: {
            '@type': 'Occupation',
            name: 'Machine Learning Engineer',
            occupationLocation: {
              '@type': 'City',
              name: 'Vijayawada'
            },
            skills: [
              'GenAI Engineering',
              'LLM Development',
              'RAG Systems',
              'Machine Learning',
              'Deep Learning',
              'NLP',
              'Python',
              'TensorFlow',
              'PyTorch'
            ]
          }
        };
        break;

      case 'website':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Daniel Joseph Kommu - GenAI & ML Engineer Portfolio',
          url: 'https://www.daniel-portfolio.in',
          description: 'Portfolio of Daniel Joseph Kommu, a GenAI & Machine Learning Engineer specializing in RAG pipelines, LLMs, and scalable AI systems.',
          author: {
            '@type': 'Person',
            name: 'Daniel Joseph Kommu'
          },
          publisher: {
            '@type': 'Person',
            name: 'Daniel Joseph Kommu'
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://www.daniel-portfolio.in/search?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        };
        break;

      case 'project':
        if (data) {
          structuredData = {
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: data.name || 'Project',
            description: data.description || '',
            author: {
              '@type': 'Person',
              name: 'Daniel Joseph Kommu'
            },
            codeRepository: data.github || '',
            programmingLanguage: data.technologies || ['Python'],
            url: data.url || `https://www.daniel-portfolio.in/projects`,
            image: data.image || 'https://www.daniel-portfolio.in/portfolio.jpeg'
          };
        }
        break;

      default:
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Daniel Joseph Kommu Portfolio',
          url: 'https://www.daniel-portfolio.in'
        };
    }

    // Add the structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup
    return () => {
      script.remove();
    };
  }, [type, data]);

  return null;
}

// Pre-defined structured data for common use cases
export const PersonSchema = () => <StructuredData type="person" />;
export const WebsiteSchema = () => <StructuredData type="website" />;
export const ProjectSchema = ({ data }: { data: any }) => <StructuredData type="project" data={data} />;