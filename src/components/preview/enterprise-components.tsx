"use client";

import { useState } from "react";
import { StyleScope } from "./style-scope";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StyleSeed } from "@/lib/styles/types";

const devices = [{ name: "一号巡检设备", id: "EQ-001", status: "在线" }, { name: "二号巡检设备", id: "EQ-002", status: "离线" }];

export function EnterpriseComponents({ seed }: { seed: StyleSeed }) {
  return (
    <Tabs defaultValue="web">
      <p className="mb-4 text-sm text-muted-foreground">两端共享配色、字体和状态含义；布局、控件尺寸与操作方式分别适配。以下为组件设计示例。</p>
      <TabsList><TabsTrigger value="web">Web 组件</TabsTrigger><TabsTrigger value="mobile">移动端组件</TabsTrigger></TabsList>
      {(["web", "mobile"] as const).map(platform => (
        <TabsContent key={platform} value={platform} className="pt-4">
          <EnterpriseSpecimen seed={seed} mobile={platform === "mobile"} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function EnterpriseSpecimen({ seed, mobile }: { seed: StyleSeed; mobile: boolean }) {
  const [query, setQuery] = useState("");
  const rows = devices.filter(device => `${device.name} ${device.id}`.includes(query.trim()));
  return (
    <StyleScope seed={seed} platform={mobile ? "mobile" : "web"} className="enterprise-specimen rounded-xl border" style={{ maxWidth: mobile ? 390 : undefined, margin: "0 auto", padding: mobile ? 16 : 24 }}>
      <div style={{ display: "grid", gap: 24 }}>
        <section>
          <h3 className="mb-3 font-medium">操作与输入</h3>
          <label htmlFor={`device-query-${mobile}`} className="mb-2 block">设备名称或编号</label>
          <input id={`device-query-${mobile}`} className="ds-input" placeholder="搜索设备" value={query} onChange={event => setQuery(event.target.value)} style={{ maxWidth: mobile ? undefined : 320 }} />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="ds-btn ds-btn-secondary" onClick={() => setQuery("")}>重置筛选</button>
            <button type="button" className="ds-btn" disabled>批量导出（不可用）</button>
          </div>
        </section>
        <section>
          <h3 className="mb-3 font-medium">{mobile ? "设备列表" : "设备表格"}</h3>
          {mobile ? <div className="grid gap-3">{rows.map(device => <article key={device.id} className="ds-card"><div className="flex items-center justify-between gap-3"><h4>{device.name}</h4><Status value={device.status} /></div><p className="ds-muted mt-2">编号：{device.id}</p></article>)}</div> :
            <div style={{ overflowX: "auto", border: "1px solid var(--border-default)", borderRadius: 4 }}><table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}><thead style={{ background: "var(--bg-surface-alt)" }}><tr>{["设备名称", "设备编号", "运行状态"].map(label => <th key={label} style={{ padding: "12px 16px", fontWeight: 500 }}>{label}</th>)}</tr></thead><tbody>{rows.map(device => <tr key={device.id} style={{ height: 44, borderTop: "1px solid var(--border-default)" }}><td style={{ padding: "8px 16px" }}>{device.name}</td><td style={{ padding: "8px 16px" }}>{device.id}</td><td style={{ padding: "8px 16px" }}><Status value={device.status} /></td></tr>)}</tbody></table></div>}
          {!rows.length && <p role="status" className="ds-muted py-6 text-center">没有匹配的设备</p>}
        </section>
        <section>
          <h3 className="mb-3 font-medium">{mobile ? "底部操作面板" : "确认对话框"} · 静态示意</h3>
          <div style={{ background: "var(--dialog-overlay)", padding: mobile ? "48px 0 0" : 24, borderRadius: 8, display: "flex", justifyContent: "center" }}>
            <div className="ds-dialog" style={{ width: "100%", maxWidth: mobile ? undefined : 400, borderRadius: mobile ? "12px 12px 0 0" : 8 }}>
              <h4 className="font-medium">提交巡检记录？</h4><p className="ds-muted mt-2">提交后，本次巡检记录将进入审核流程。</p>
              <div className="mt-5 flex gap-2" style={{ flexDirection: mobile ? "column" : "row", justifyContent: "flex-end" }}>
                <span className="ds-btn ds-btn-secondary" style={{ textAlign: "center" }}>取消</span><span className="ds-btn ds-btn-primary" style={{ textAlign: "center" }}>确认提交</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </StyleScope>
  );
}

function Status({ value }: { value: string }) {
  return <span className="inline-flex items-center gap-2 whitespace-nowrap"><span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: value === "在线" ? "var(--shigan-online)" : "var(--shigan-offline)" }} />{value}</span>;
}
