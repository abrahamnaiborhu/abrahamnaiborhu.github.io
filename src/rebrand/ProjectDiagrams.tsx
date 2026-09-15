import * as React from 'react';

export function DeliveryDiagram() {
  return <React.Fragment>
    <div className="delivery-lanes">
      <div><p className="diagram-step">Review / pull request</p>
        <ol className="delivery-flow">
          <li>WIF authentication</li><li>Init · Validate · Plan</li><li>PR summary + artifact</li>
        </ol>
      </div>
      <div><p className="diagram-step">Execute / manual trigger</p>
        <ol className="delivery-flow">
          <li>WIF → Init → Fresh plan</li><li>Environment approval</li><li>New job: WIF → Init → Apply saved plan</li>
        </ol>
      </div>
    </div>
    <p className="diagram-note">PR plan is for review. The manual workflow generates its own execution plan before the approval gate. Both jobs authenticate independently.</p>
    <p className="diagram-note">The delivery layer of the platform below—not a separate deployed service.</p>
  </React.Fragment>;
}

export function PlatformDiagram() {
  return <React.Fragment>
    <ol className="platform-flow">
      <li><span className="diagram-step">Inbound / application requests</span><strong>Internet → External load balancer</strong></li>
      <li className="platform-boundary"><span className="diagram-step">VPC / application subnet</span><strong>Regional managed instance group</strong><span>Private application VMs · no external IPs</span>
        <p className="platform-probes">Health checks → Firewall → /healthz</p>
      </li>
      <li><span className="diagram-step">Outbound only / from private VMs</span><strong>Cloud NAT → Internet</strong></li>
    </ol>
    <p className="diagram-note">NAT provides outbound connectivity; it is not the inbound request path. This is an architecture pattern, not a live availability claim.</p>
  </React.Fragment>;
}
