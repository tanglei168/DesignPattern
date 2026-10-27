"use client";
import { CircleAlert, TriangleAlert, Info } from "lucide-react";
import { useState } from "react";
import { StyleScope } from "@/components/preview/style-scope";
import type { StyleSeed } from "@/lib/styles/types";
const devices = [
  { name: '设备 001', online: true, risk: 'high', label: '高风险', icon: CircleAlert },
  { name: '设备 002', online: true, risk: 'medium', label: '中风险', icon: TriangleAlert },
  { name: '设备 003', online: false, risk: 'low', label: '低风险', icon: Info },
];
export function ShiganPreview({seed, mobile = false}: {seed: StyleSeed; mobile?: boolean}) {
  const [onlineOnly, setOnlineOnly] = useState(false);
  const rows = devices.filter(d=>!onlineOnly || d.online);
  return <StyleScope seed={seed} platform={mobile ? "mobile" : "web"} className={mobile ? 'ds-mobile' : undefined}>
    <header className="ds-nav"><strong>实干家</strong><span style={{color:'var(--nav-active)'}}>设备监控</span><span style={{color:'var(--nav-muted)'}}>演示数据</span></header>
    <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'minmax(90px, 1fr) 4fr'}}>
      {!mobile && <aside style={{background:'var(--nav-bg)',color:'var(--nav-fg)',padding:'var(--space-4)'}}>
        <p style={{background:'var(--sg-nav-selected)',borderLeft:'3px solid var(--action-primary)',padding:'var(--space-2)',color:'var(--nav-active)'}}>设备列表</p>
        <p style={{padding:'var(--space-2)',color:'var(--nav-muted)'}}>风险概览</p>
      </aside>}
      <section aria-label="设备状态示例" style={{padding:'var(--space-container)',minWidth:0}}>
        <h3 className="ds-title">设备状态</h3>
        <p className="ds-muted" style={{marginBlock:'var(--space-3)'}}>在线与风险分列展示，避免同色误读。</p>
        <button className="ds-btn ds-btn-primary" aria-pressed={onlineOnly} onClick={()=>setOnlineOnly(v=>!v)}>{onlineOnly?'显示全部':'只看在线'}</button>
        <div style={{overflowX:'auto',marginTop:'var(--space-4)'}}>
          <table style={{width:'100%',borderCollapse:'collapse',background:'var(--bg-surface)',fontSize:'var(--text-body)'}}>
            <caption className="sr-only">设备在线状态和风险等级</caption>
            <thead><tr>{['设备','状态','风险'].map(t=><th key={t} scope="col" style={{textAlign:'left',padding:'var(--space-2)',color:'var(--fg-muted)'}}>{t}</th>)}</tr></thead>
            <tbody>{rows.map(d=><tr key={d.name} style={{height:'var(--sg-table-row)',borderTop:'var(--border-width-divider) solid var(--border-default)'}}>
              <td style={{padding:'var(--space-2)'}}>{d.name}</td>
              <td style={{padding:'var(--space-2)'}}><span aria-hidden style={{color:d.online?'var(--sg-online)':'var(--sg-offline)',textShadow:d.online?'0 0 1px var(--fg-primary)':undefined}}>●</span> {d.online?'在线':'离线'}</td>
              <td style={{padding:'var(--space-2)'}}><span aria-hidden style={{color:`var(--sg-risk-${d.risk})`}}><d.icon size={16} style={{display:"inline-block",verticalAlign:"middle"}} /></span> {d.label}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <p className="ds-muted" aria-live="polite" style={{marginTop:'var(--space-3)'}}>显示 {rows.length} 台设备 · 附件适配示例</p>
      </section>
    </div>
    {mobile && <nav className="ds-tabbar" aria-label="导航示意"><span className="ds-tab" data-active="true">设备</span><span className="ds-tab">统计</span><span className="ds-tab">我的</span></nav>}
  </StyleScope>;
}
