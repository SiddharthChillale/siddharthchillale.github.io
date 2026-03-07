import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const timeline = [
  {
    period: '2021-2023',
    items: [
      {
        title: 'Masters in Computer Science',
        subtitle: 'University at Buffalo',
        details: 'GPA - 3.4/4.0',
      },
      {
        title: 'Backend Web Developer',
        subtitle: 'University at Buffalo',
      },
    ],
  },
  {
    period: '2017-2021',
    items: [
      {
        title: 'B Tech, Department of Computer Science',
        subtitle: 'Indian Institute of Information Technology, Tiruchirappalli',
        details: 'CGPA - 8.81/10',
      },
      {
        title: 'Teaching Assistant',
        subtitle: 'ShiP.py',
      },
      {
        title: 'Hosted HacktoberFest Event',
        subtitle: 'IIIT Tiruchirappalli',
      },
      {
        title: 'Frontend Developer',
        subtitle: 'Xungry',
      },
    ],
  },
  {
    period: '2017',
    items: [
      {
        title: 'Intermediate',
        subtitle: 'Rajiv Gandhi School of e-learning, Pune',
      },
    ],
  },
  {
    period: '2015',
    items: [
      {
        title: 'Matriculation',
        subtitle: 'Mona School, Maharashtra',
      },
    ],
  },
];

const certifications = [
  {
    title: 'AWS Certified Cloud Practitioner (CLF)',
    id: 'Q4B80MS2V1VE14S9',
    period: 'July 2023 - July 2026',
    major: true,
  },
  {
    title: 'Mastering C++ - LinkedIn',
    details: [
      'Standard Template Library',
      'Test-Driven Development in C++',
      'Parallel and Concurrent Programming',
      'Advanced Topics in C++ (lambdas, rvalue-lvalue references, move semantics)',
    ],
    major: false,
  },
  {
    title: 'Deep Learning Specialization - Andrew Ng',
    organization: 'Coursera | Deeplearning.ai',
    id: 'P5R349GJHTFX',
    date: 'May 2020',
    url: 'https://www.coursera.org/account/accomplishments/certificate/P5R349GJHTFX',
    major: false,
  },
  {
    title: 'Machine Learning - Andrew Ng',
    organization: 'Coursera | Stanford',
    id: 'SFMCHP7F6W9C',
    date: 'Jan 2020',
    url: 'https://www.coursera.org/account/accomplishments/verify/SFMCHP7F6W9C',
    major: false,
  },
  {
    title: 'Probability and Statistics',
    organization: 'Coursera | University of London',
    id: '74M4UJXAGWA2',
    date: 'Apr 2020',
    url: 'https://coursera.org/share/6530c259db28487e4da9de750e0d7272',
    major: false,
  },
];

const interests = [
  'Server side development',
  'Cloud Engineering',
  'Low-level software systems',
  'Computer Graphics and 3D rendering',
];

const readingList = [
  {
    category: 'Soft Skills',
    title: "The Software Developer's Life Manual - John Sonmez",
  },
  {
    category: 'Architecture',
    title: 'Architecture of Consoles',
    url: 'https://www.copetti.org/writings/consoles/',
  },
];

export default function AboutPage() {
  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        {/* Profile Section */}
        <section className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
              <img
                src="/profile/SiddharthChillale_square.jpg"
                alt="Siddharth Chillale"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Hi! I&apos;m Siddharth Chillale
          </h1>
          
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
            I completed my Masters in Computer Science at University at Buffalo.
            I love reading books, programming, and books on programming. I also draw, paint and admire art of any kind.
            I play Table Tennis, Badminton and I like to think I&apos;m good at it!
            Curious, tenacious and persistent are some adjectives that define me.
            I constantly try to expand my world view by seeking out new and fresh experiences.
          </p>
        </section>

        {/* Interests */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Topics of Interest</h2>
          <ul className="grid gap-2 md:grid-cols-2">
            {interests.map((interest) => (
              <li key={interest} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {interest}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={`mailto:${siteConfig.email}`}>Email</a>
            </Button>
            <Button asChild variant="outline">
              <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </Button>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8">Timeline</h2>
          
          <div className="space-y-8">
            {timeline.map((period) => (
              <div key={period.period}>
                <h3 className="text-lg font-semibold text-primary mb-4">{period.period}</h3>
                <div className="space-y-4">
                  {period.items.map((item, idx) => (
                    <div key={idx} className="pl-4 border-l-2 border-muted">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                      {item.details && (
                        <p className="text-sm text-muted-foreground">{item.details}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Certifications */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Certifications</h2>
          
          <div className="space-y-6">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  cert.major ? 'bg-primary/5 border-primary/20' : 'bg-card'
                }`}
              >
                {cert.major ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{cert.title}</h3>
                      <p className="text-sm text-muted-foreground">{cert.period}</p>
                    </div>
                    <span className="text-xs font-mono bg-primary/10 px-2 py-1 rounded">
                      ID: {cert.id}
                    </span>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold">{cert.title}</h3>
                    {cert.organization && (
                      <p className="text-sm text-muted-foreground">{cert.organization}</p>
                    )}
                    {cert.details && (
                      <ul className="mt-2 space-y-1">
                        {cert.details.map((detail, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                    {cert.id && (
                      <p className="text-xs text-muted-foreground mt-2 font-mono">
                        Credential ID: {cert.id}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Reading List */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What I&apos;m Reading</h2>
          <div className="space-y-3">
            {readingList.map((book, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-xl">📚</span>
                <div>
                  <p className="font-medium">
                    {book.url ? (
                      <a
                        href={book.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {book.title}
                      </a>
                    ) : (
                      book.title
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{book.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Posts CTA */}
        <section className="text-center py-8">
          <Button asChild size="lg">
            <Link href="/blog">View All Blog Posts</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
