import{L as J,aA as K,M as Q,aB as Y,P as tt,aD as et,a as s,af as w,O as at,m as it,az as rt,am as st,A as F,al as nt,x as ot,n as lt,B as ct,H as dt}from"./vendor-mermaid-DhkD0HAw.js";import{p as pt}from"./chunk-4BX2VUAB-w60ISBTS.js";import{p as gt}from"./wardley-L42UT6IY-CfZqnJm_.js";import"./vendor-mathjax-zyCnoC-V.js";import"./vendor-sanitize-8E279hYE.js";var ht=dt.pie,D={sections:new Map,showData:!1},u=D.sections,C=D.showData,ut=structuredClone(ht),ft=s(()=>structuredClone(ut),"getConfig"),mt=s(()=>{u=new Map,C=D.showData,lt()},"clear"),vt=s(({label:t,value:a})=>{if(a<0)throw new Error(`"${t}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);u.has(t)||(u.set(t,a),w.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),xt=s(()=>u,"getSections"),St=s(t=>{C=t},"setShowData"),wt=s(()=>C,"getShowData"),L={getConfig:ft,clear:mt,setDiagramTitle:et,getDiagramTitle:tt,setAccTitle:Y,getAccTitle:Q,setAccDescription:K,getAccDescription:J,addSection:vt,getSections:xt,setShowData:St,getShowData:wt},Dt=s((t,a)=>{pt(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),Ct={parse:s(async t=>{const a=await gt("pie",t);w.debug(a),Dt(a,L)},"parse")},$t=s(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),yt=$t,Tt=s(t=>{const a=[...t.values()].reduce((r,o)=>r+o,0),$=[...t.entries()].map(([r,o])=>({label:r,value:o})).filter(r=>r.value/a*100>=1);return ct().value(r=>r.value).sort(null)($)},"createPieArcs"),At=s((t,a,$,y)=>{var W;w.debug(`rendering pie chart
`+t);const r=y.db,o=at(),T=it(r.getConfig(),o.pie),A=40,n=18,p=4,c=450,d=c,f=rt(a),l=f.append("g");l.attr("transform","translate("+d/2+","+c/2+")");const{themeVariables:i}=o;let[b]=st(i.pieOuterStrokeWidth);b??(b=2);const E=T.textPosition,g=Math.min(d,c)/2-A,G=F().innerRadius(0).outerRadius(g),O=F().innerRadius(g*E).outerRadius(g*E);l.append("circle").attr("cx",0).attr("cy",0).attr("r",g+b/2).attr("class","pieOuterCircle");const h=r.getSections(),P=Tt(h),I=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let m=0;h.forEach(e=>{m+=e});const _=P.filter(e=>(e.data.value/m*100).toFixed(0)!=="0"),v=nt(I).domain([...h.keys()]);l.selectAll("mySlices").data(_).enter().append("path").attr("d",G).attr("fill",e=>v(e.data.label)).attr("class","pieCircle"),l.selectAll("mySlices").data(_).enter().append("text").text(e=>(e.data.value/m*100).toFixed(0)+"%").attr("transform",e=>"translate("+O.centroid(e)+")").style("text-anchor","middle").attr("class","slice");const N=l.append("text").text(r.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),k=[...h.entries()].map(([e,S])=>({label:e,value:S})),x=l.selectAll(".legend").data(k).enter().append("g").attr("class","legend").attr("transform",(e,S)=>{const B=n+p,Z=B*k.length/2,j=12*n,q=S*B-Z;return"translate("+j+","+q+")"});x.append("rect").attr("width",n).attr("height",n).style("fill",e=>v(e.label)).style("stroke",e=>v(e.label)),x.append("text").attr("x",n+p).attr("y",n-p).text(e=>r.getShowData()?`${e.label} [${e.value}]`:e.label);const U=Math.max(...x.selectAll("text").nodes().map(e=>(e==null?void 0:e.getBoundingClientRect().width)??0)),H=d+A+n+p+U,R=((W=N.node())==null?void 0:W.getBoundingClientRect().width)??0,V=d/2-R/2,X=d/2+R/2,z=Math.min(0,V),M=Math.max(H,X)-z;f.attr("viewBox",`${z} 0 ${M} ${c}`),ot(f,c,M,T.useMaxWidth)},"draw"),bt={draw:At},Wt={parser:Ct,db:L,renderer:bt,styles:yt};export{Wt as diagram};
