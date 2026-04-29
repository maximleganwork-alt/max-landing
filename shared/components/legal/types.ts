/**
 * Per-site config consumed by shared legal components.
 * The studio (legal operator) is one; what differs between sites is the domain
 * and the formulation of "purpose of processing" for the policy.
 */
export interface LegalSiteConfig {
  domain: string;
  purpose: string;
}
