import Link from 'next/link';
import { ArrowLeft, CircleCheck, TriangleAlert, Wrench } from 'lucide-react';
import { zar, type Actor, type Vehicle } from '@/lib/api';
import { Shell } from './shell';
import { Status } from './boss-dashboard';

export function BossVehicleDetail({user,car}:{user:Actor;car:Vehicle}) {
  return <Shell portal="boss" user={user} current="Vehicle details">
    <div className="title-row detail-title"><div><span className="overline dark">VEHICLE PROFILE / {car.plate}</span><h1>{car.make} {car.model}</h1><p>{car.year} · {car.location||'Location not specified'}</p></div><Link href="/dashboard#inventory" className="btn light"><ArrowLeft size={16}/> All vehicles</Link></div>
    <div className="detail-columns"><div className="detail-primary">
      <section className="card"><div className="card-head"><div><h3>Vehicle profile</h3><p>Identity and current health condition</p></div><Status value={car.status}/></div>
        <div className="vehicle-cover">{car.image_url?<img src={car.image_url} alt={`${car.make} ${car.model}`}/>:<span>FLG <b>CARS</b></span>}</div>
        <div className="facts">{[['Registration',car.plate],['VIN / chassis',car.vin||'Not recorded'],['Model year',car.year],['Colour',car.color||'—'],['Current location',car.location||'—'],['Repair estimate',zar(car.estimate)]].map(([name,value])=><div key={name}><small>{name}</small><b>{value}</b></div>)}</div>
      </section>
      <section className="card detail-repairs"><div className="card-head"><div><h3>Condition reports</h3><p>{car.issues.length} active repair issue(s)</p></div></div>
        {!car.issues.length?<div className="health-banner"><CircleCheck size={21}/> Completely fine. No active repair issues or parts required.</div>:
        <div className="repair-cards">{car.issues.map(issue=><div className="repair-box" key={issue.id}><div className="repair-head"><div><strong>{issue.category} system</strong><small>{issue.severity} severity</small></div><b>{zar(issue.estimated_total)}</b></div><p>{issue.description}</p><div className="labour-line">Labour allowance <b>{zar(issue.labor_cost)}</b></div>
          <div className="parts-list">{issue.parts.map(part=><div key={part.id}><span><strong>{part.name}</strong><small>{part.quantity} × {zar(part.unit_cost)} · {part.supplier||'Supplier pending'} · {part.sourcing_status}</small></span><b>{zar(part.quantity*part.unit_cost)}</b></div>)}</div>
        </div>)}</div>}
      </section>
    </div><aside className="detail-side"><section className="card"><div className="card-head"><div><h3>Health assessment</h3><p>Calculated from active issues</p></div></div>
      <div className={`assessment ${car.status==='HEALTHY'?'good':'warn'}`}>{car.status==='HEALTHY'?<CircleCheck size={20}/>:<TriangleAlert size={20}/>}<span>{car.status==='HEALTHY'?'Healthy status — vehicle is completely fine.':'Attention required — outstanding work recorded.'}</span></div>
      <div className="mini-facts"><div><span>Active issues</span><strong>{car.issues.length}</strong></div><div><span>Repair estimate</span><strong>{zar(car.estimate)}</strong></div></div>
    </section><div className="read-only-note"><Wrench size={18}/><span>Read-only report. Contact an Administrator to request changes.</span></div></aside></div>
  </Shell>;
}
