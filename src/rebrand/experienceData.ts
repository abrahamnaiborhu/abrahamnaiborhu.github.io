// Approved public employment facts from rebrand spec §§1.6 and 15.
export const experience = [
  {
    company: 'PointStar PTE LTD', role: 'Application Engineer', location: 'Jakarta',
    start: '2025-09', startLabel: 'Sep 2025', end: null, endLabel: 'Present',
    highlights: [
      'Designed and deployed Google Cloud infrastructure using VPCs, Managed Instance Groups, Cloud NAT, HTTP Load Balancing, Cloud Run, and Docker.',
      'Built keyless CI/CD pipelines with GitHub Actions and Workload Identity Federation, and managed Terraform using modular configurations, remote GCS state, and drift detection.',
      'Supported production workloads through monitoring, logging, troubleshooting, performance analysis, and deployment operations.',
      'Built backend services and REST APIs for workflow automation, Google Workspace provisioning, and AI-enabled applications.',
    ],
  },
  {
    company: 'Hand Global Solutions', role: 'Oracle NetSuite Technical Consultant', location: 'Jakarta',
    start: '2024-04', startLabel: 'Apr 2024', end: '2025-09', endLabel: 'Sep 2025',
    highlights: [
      'Translated business requirements into technical solutions using SuiteScript and SuiteFlow.',
      'Customized NetSuite modules and automated PDF/Excel outputs with XML templates.',
      'Supported functional teams through troubleshooting, knowledge transfer, and feature delivery.',
    ],
  },
  {
    company: 'Indomaret Group', role: 'VB.NET Developer', location: 'Jakarta',
    start: '2023-11', startLabel: 'Nov 2023', end: '2024-04', endLabel: 'Apr 2024',
    highlights: [
      'Built and maintained VB.NET applications backed by MySQL.',
      'Delivered software enhancements and production fixes.',
      'Introduced React wrapped in Electron.js to modernize front-end workflows.',
      'Reduced defects in the RRAK project and improved application stability.',
    ],
  },
  {
    company: 'PT Mattel Indonesia', role: 'Software Engineer Intern', location: 'Cikarang',
    start: '2022-11', startLabel: 'Nov 2022', end: '2023-11', endLabel: 'Nov 2023',
    highlights: [
      'Built internal ASP.NET MVC applications for security/facility workflows.',
      'Maintained and optimized 11 internal applications across ASP.NET, VB.NET, Power Automate, and Power Apps.',
    ],
  },
] as const;
