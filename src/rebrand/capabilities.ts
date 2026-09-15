// Public capability inventory supplied in the rebrand spec §13; not proficiency scores.
export const capabilities = [
  {
    title: 'Cloud Infrastructure',
    technologies: ['Google Cloud', 'Compute Engine', 'Cloud Run', 'VPC', 'MIG', 'Cloud NAT', 'HTTP Load Balancing', 'Secret Manager', 'Cloud Monitoring'],
  },
  {
    title: 'Platform & DevOps',
    technologies: ['Terraform', 'GitHub Actions', 'GitLab CI/CD', 'WIF', 'Docker', 'Remote State', 'Drift Detection'],
  },
  {
    title: 'Kubernetes & Linux',
    technologies: ['Kubernetes', 'kubectl', 'kubeadm', 'RBAC', 'Services', 'Networking', 'Storage', 'Helm', 'Kustomize', 'Linux'],
  },
  {
    title: 'Software Engineering',
    technologies: ['Node.js', 'Express', 'Prisma', 'REST APIs', 'React', 'PostgreSQL', 'MySQL', 'MongoDB', 'JavaScript'],
  },
] as const;
