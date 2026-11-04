import Link from 'next/link';
import { ArrowUpRight, CarFront, CircleCheck, TriangleAlert, Wrench, Search, ShieldCheck } from 'lucide-react';
import { zar, type Actor, type Vehicle } from '@/lib/api';
import { Shell } from './shell';

export function Status({ value }: {value: Vehicle['status']}) {
  return <span className={`status ${value === 'HEALTHY' ? 'healthy' : 'damaged'}`}><i/>{value === 'HEALTHY' ? 'Healthy' : 'Needs repair'}</span>;
}

function Metric({title,value,note,Icon,color=''}:{title:string;value:string|number;note:string;Icon:typeof CarFront;color?:string}) {
  return <div className="metric"><div className="metric-top"><span>{title}</span><div className={`metric-icon ${color}`}><Icon size={18}/></div></div><strong>{value}</strong><small>{note}</small></div>;
}

export function BossDashboard({user,data,query}:{user:Actor;data:Vehicle[];query?:string}) {
  const total=data.length;
  const healthy=data.filter(v=>v.status==='HEALTHY').length;
  const damaged=total-healthy;
  const pct=total?Math.round(healthy/total*100):0;
  const issues=data.flatMap(v=>v.issues.map(i=>({...i,car:v}))).sort((a,b)=>b.estimated_total-a.estimated_total);
  const estimate=data.reduce((sum,v)=>sum+v.estimate,0);
  const shown=data.filter(v=>!query||`${v.make} ${v.model} ${v.plate} ${v.vin}`.toLowerCase().includes(query.toLowerCase()));
  const bySystem=new Map<string,number>();
  for(const issue of issues) bySystem.set(issue.category,(bySystem.get(issue.category)||0)+issue.estimated_total);
  const max=Math.max(1,...bySystem.values());

  return <Shell portal="boss" user={user} current="Overview">
    <div className="title-row"><div><span className="overline dark">FLEET MANAGEMENT / EXECUTIVE VIEW</span><h1>Fleet overview</h1><p>A clear view of vehicle health, repair exposure and parts requirements.</p></div><div className="read-only"><ShieldCheck size={15}/> Read-only access</div></div>
    <div className="metrics-grid">
      <Metric title="Total vehicles" value={total} note="All vehicles in your fleet" Icon={CarFront}/>
      <Metric title="Healthy vehicles" value={healthy} note={`${pct}% of total fleet`} Icon={CircleCheck} color="green"/>
      <Metric title="Require attention" value={damaged} note={`${issues.length} active repair issues`} Icon={TriangleAlert} color="amber"/>
      <Metric title="Total repair estimate" value={zar(estimate)} note="Parts + estimated labour" Icon={Wrench} color="blue"/>
    </div>
    <div className="two-col"><section className="card"><div className="card-head"><div><h3>Vehicle health distribution</h3><p>Current condition across the fleet</p></div><span className="status healthy">{pct}% Healthy</span></div>
      <div className="health-chart"><div className="donut" style={{background:`conic-gradient(#32ad7d 0 ${pct}%,#f0ad4d ${pct}% 100%)`}}><div><strong>{total}</strong><small>Total vehicles</small></div></div>
      <div className="chart-legend"><div><i className="green-dot"/><span>Healthy<small>No active issues</small></span><strong>{healthy}</strong></div><div><i className="amber-dot"/><span>Damaged<small>Attention required</small></span><strong>{damaged}</strong></div></div></div>
    </section><section className="card"><div className="card-head"><div><h3>Priority attention</h3><p>Highest-cost active repairs</p></div><a href="#repairs" className="text-link">View all</a></div>
      <div className="attention-list">{issues.slice(0,3).map(i=><Link href={`/vehicles/${i.vehicle_id}`} key={i.id} className="attention"><span className="warning"><TriangleAlert size={16}/></span><div><strong>{i.car.make} {i.car.model}</strong><small>{i.category} · {i.severity}</small></div><b>{zar(i.estimated_total)}</b></Link>)}{!issues.length&&<p className="empty">No active repairs. Your fleet is healthy.</p>}</div>
    </section></div>
    <section id="inventory" className="card inventory"><div className="card-head"><div><h3>Vehicle inventory</h3><p>All vehicle profiles and live condition</p></div><span className="status healthy">{healthy} healthy</span></div>
      <form method="get" action="/dashboard" className="table-tools"><div className="search-box"><Search size={16}/><input name="q" defaultValue={query||''} placeholder="Search vehicle or registration"/></div><button className="btn light" type="submit">Search</button></form>
      <div className="table-wrap"><table><thead><tr><th>Vehicle</th><th>Registration</th><th>Condition</th><th>Issues</th><th>Repair estimate</th><th></th></tr></thead><tbody>{shown.map(v=><tr key={v.id}><td><div className="vehicle-ident"><span className="car-tile">{v.image_url?<img src={v.image_url} alt=""/>:<CarFront size={23}/>}</span><div><strong>{v.make} {v.model}</strong><small>{v.year} · {v.color}</small></div></div></td><td>{v.plate}</td><td><Status value={v.status}/></td><td>{v.issues.length}</td><td className="money">{zar(v.estimate)}</td><td><Link href={`/vehicles/${v.id}`} className="open-arrow" aria-label={`View ${v.make} ${v.model}`}><ArrowUpRight size={17}/></Link></td></tr>)}</tbody></table>{!shown.length&&<p className="empty">No vehicles match this search.</p>}</div><div className="card-footer">Showing {shown.length} of {total} vehicles</div>
    </section>
    <div className="two-col lower"><section className="card" id="repairs"><div className="card-head"><div><h3>Open repair tracker</h3><p>Issue-level costs and parts information</p></div></div><div className="issue-summary">{issues.map(i=><div className="repair-list-item" key={i.id}><div className="repair-head"><div><strong>{i.car.make} {i.car.model}</strong><small>{i.category} · {i.severity}</small></div><b>{zar(i.estimated_total)}</b></div><p>{i.description}</p><div className="part-tags">{i.parts.map(p=><span key={p.id}>{p.name} × {p.quantity} · {p.sourcing_status}</span>)}</div><Link className="text-link" href={`/vehicles/${i.vehicle_id}`}>View report →</Link></div>)}{!issues.length&&<p className="empty">No active repair issues.</p>}</div></section>
      <section className="card" id="analytics"><div className="card-head"><div><h3>Estimated cost by system</h3><p>Where repair spending is concentrated</p></div></div><div className="category-chart">{[...bySystem.entries()].sort((a,b)=>b[1]-a[1]).map(([name,value])=><div className="bar-group" key={name}><div><strong>{name}</strong><span>{zar(value)}</span></div><div className="bar"><span style={{width:`${value/max*100}%`}}/></div></div>)}{!bySystem.size&&<p className="empty">No repair cost exposure.</p>}</div></section>
    </div>
  </Shell>;
}
