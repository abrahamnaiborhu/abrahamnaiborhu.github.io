export interface Project {
  id: string;
  title: string;
  summary: string;
  highlights: readonly string[];
  technologies: readonly string[];
  repository?: string;
  article: string;
}

export const foundation: Project = {
  id: 'foundation',
  title: 'GCP Terraform Foundation',
  summary: 'A reusable Google Cloud infrastructure foundation designed around modular networking, controlled firewall provisioning, and versioned remote Terraform state.',
  highlights: [
    'Separated state-bucket bootstrap from the foundation that consumes it.',
    'Built reusable network and IAM modules for VPC, subnets, firewall rules, and service accounts.',
    'Enabled object versioning on the GCS backend to retain previous state versions.',
  ],
  technologies: ['Terraform', 'Google Cloud', 'VPC', 'GCS', 'IAM'],
  repository: 'https://github.com/abrahamnaiborhu/GCP-Terraform-Foundation-Lite',
  article: 'https://dev.to/abrahamnaiborhu/building-a-gcp-terraform-foundation-vpc-iam-and-remote-state-54jp',
};
