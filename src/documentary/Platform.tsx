import { ArrowIcon } from '../components/ArrowIcon';
import { usePlatformScroll } from './usePlatformScroll';
import { PlatformIllustration } from './PlatformIllustration';

export function Platform() {
 const film = usePlatformScroll();
 return (<section id="team" tabIndex={-1} className="scene team-scene" aria-labelledby="team-title">
        <div className="scene-top"><span>A platform for the team</span><span>On premises · Non-production</span></div>
        <div className="team-heading"><div className="narration"><h2 id="team-title">Then I built<br />a place for<br /><em>our applications.</em></h2></div><div className="team-account"><p>I independently designed and implemented our on-premises Kubernetes platform for development and staging, and onboarded my peers’ applications.</p><p>My responsibility ran from preparing the hardware to networking, GitOps delivery, observability and helping developers package their applications.</p></div></div>
        <div className="platform-strip" aria-label="Areas of platform responsibility"><span>Hardware</span><span>Networking</span><span>Delivery</span><span>Observability</span><span>Developer onboarding</span></div>
        <div ref={film} className="platform-film" data-scroll="false" data-step="complete"><div className="platform-stage"><div className="platform-stage-heading"><p className="eyebrow">A developer’s change</p><h3>From source to running software.</h3></div><figure className="platform-story">
          <PlatformIllustration />
          <ol className="platform-mobile-flow"><li>Source change <span>Developer</span></li><li>Check + build <span>Container image</span></li><li>Record + reconcile <span>Versioned config · Argo CD</span></li><li>Run the application <span>Kubernetes</span></li><li>Observe <span>Metrics · Logs · Alerts</span></li></ol>
          <figcaption>From source change to running application and operational visibility.</figcaption>
        </figure><p className="platform-explanation">A developer pushes a change. CI checks it and builds a container image tagged with the commit SHA. The deployment repository records that version; Argo CD reconciles it into the cluster. Metrics, logs and alerts provide visibility into the running application.</p>
<ol className="platform-notes"><li data-note="source">A developer pushes a change to the application repository.</li><li data-note="build">CI checks the change and builds a container image tagged with its commit SHA.</li><li data-note="config">The deployment repository records that version. Argo CD reconciles the declared state.</li><li data-note="runtime">Kubernetes runs the application. Metrics, logs and alerts provide operational visibility.</li><li data-note="complete">The workflow connects the developer’s change to a running, observable application.</li></ol><div className="platform-stage-actions"><span className="workflow-progress" aria-hidden="true"></span><a href="#platform-details">Continue to scope and technical detail <ArrowIcon direction="down" /></a></div></div></div>
        <div id="platform-details" tabIndex={-1}></div><details className="platform-detail"><summary>Inside the platform <span>Technical detail <ArrowIcon direction="down" /></span></summary><dl>
          <div><dt>Foundation and networking</dt><dd>Linux hosts, containerd and a kubeadm cluster, with Calico networking and network policies. MetalLB provides load-balancer addresses on the local network.</dd></div>
          <div><dt>Application access</dt><dd>Cloudflare Tunnel connects public access to Envoy Gateway. Gateway API routes requests; cert-manager manages origin certificates.</dd></div>
          <div><dt>Delivery and onboarding</dt><dd>GitHub Actions checks and builds container images tagged with the commit SHA. Kustomize describes environment configuration; Argo CD reconciles the declared state. I also help developers prepare their applications for container delivery.</dd></div>
          <div><dt>Data and persistence</dt><dd>PostgreSQL runs with persistent storage backed by NFS. The current design has a single database writer and shared storage dependencies.</dd></div>
          <div><dt>Operational visibility</dt><dd>Prometheus and Grafana provide metrics and dashboards. Alloy and Loki collect logs; Alertmanager routes operational notifications.</dd></div>
        </dl></details><p className="platform-status">Current non-production design · Backup and restore validation is ongoing; a separate backup destination is planned.</p>
        <div className="team-scope"><p>Current scope<br /><span>Applications and developers in the current development and staging environment.</span></p><div><strong>10</strong><span>applications</span></div><div><strong>~11</strong><span>developers</span></div></div>
      </section>);
}
