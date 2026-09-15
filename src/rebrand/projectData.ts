export interface Project {
  id: string;
  label: string;
  title: string;
  summary: string;
  highlights: readonly string[];
  technologies: readonly string[];
  repository?: string;
  article: string;
}

export const foundation: Project = {
  id: 'foundation',
  label: '01 / Infrastructure foundation',
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

export const delivery: Project = {
  id: 'delivery',
  label: '02 / Controlled delivery',
  title: 'Keyless CI/CD on Google Cloud',
  summary: 'A GitHub Actions delivery workflow using Workload Identity Federation to replace static cloud credentials with short-lived access.',
  highlights: [
    'Automated Terraform planning on pull requests, with a reviewable summary and artifact.',
    'Separated manual apply into a fresh planning job and an environment-gated execution job.',
    'Authenticated each job through WIF before accessing remote state or Google Cloud APIs.',
  ],
  technologies: ['GitHub Actions', 'Terraform', 'WIF', 'Google Cloud'],
  repository: 'https://github.com/abrahamnaiborhu/terraform-gcp-production-lite-web-platform',
  article: 'https://dev.to/abrahamnaiborhu/terraform-cicd-with-google-cloud-plan-on-pull-request-and-apply-with-approval-3h3m',
};

export const platform: Project = {
  id: 'platform',
  label: '03 / Private compute, public entry',
  title: 'Production-Lite GCP Web Platform',
  summary: 'A Google Cloud web platform pattern combining private compute, a managed instance group, health checks, Cloud NAT, and external load balancing.',
  highlights: [
    'Kept application VMs without external IP addresses, behind an external load balancer.',
    'Provisioned a regional managed instance group and an explicit /healthz endpoint.',
    'Separated inbound application traffic from outbound access through Cloud NAT.',
  ],
  technologies: ['Terraform', 'Compute Engine', 'MIG', 'Cloud NAT', 'Load Balancing'],
  repository: 'https://github.com/abrahamnaiborhu/terraform-gcp-production-lite-web-platform',
  article: 'https://dev.to/abrahamnaiborhu/terraforming-a-production-lite-gcp-web-platform-mig-cloud-nat-load-balancer-and-private-backends-1bfg',
};
