var e=Object.defineProperty,a=Object.defineProperties,l=Object.getOwnPropertyDescriptors,t=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,p=(a,l,t)=>l in a?e(a,l,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[l]=t,d=(e,a)=>{for(var l in a||(a={}))o.call(a,l)&&p(e,l,a[l]);if(t)for(var l of t(a))r.call(a,l)&&p(e,l,a[l]);return e};import{M as i,A as u,C as s,r as n,o as m,c,g as y,d as f,e as b,w as g,N as v,F as _,a as T,b as h,f as w,t as V,_ as S}from"./vendor.b1d65a4d.js";import{u as C,a as k}from"./index.605a31b6.js";import{_ as x}from"./zh-cn.a582dec9.js";const D={class:"leave-manager"},j={class:"query-form"},N=w("查询"),O=w("重置"),U={class:"base-table"},M={class:"action"},z=w("申请休假"),q=w("查看"),P=w("作废"),A=w("-"),$={class:"dialog-footer"},F=w("取 消"),E=w("确 定"),I={setup(e){const t=x,o=i({applyState:""}),r=u([]),p=i({pageNum:1,pageSize:10}),I=i({leaveTime:"0天"}),L=i({}),B=u(""),G=u(!1),H=u(!1),J=u(null),K=u(null),Q=i([{label:"单号",prop:"orderNo",width:"100",align:"center"},{label:"休假时间",prop:"",formatter:e=>`${C.formateDate(new Date(e.startTime),"yyyy-MM-dd")} 到 ${C.formateDate(new Date(e.endTime),"yyyy-MM-dd")}`,width:"175"},{label:"休假时长",prop:"leaveTime"},{label:"休假类型",prop:"applyType",formatter:(e,a,l)=>({1:"事假",2:"调休",3:"年假"}[l])},{label:"休假原因",prop:"reasons"},{label:"申请时间",prop:"createTime",formatter:(e,a,l)=>C.formateDate(new Date(l)),width:"150"},{label:"审批人",prop:"auditUsers",width:"170"},{label:"当前审批人",prop:"curAuditUserName"},{label:"审批状态",prop:"applyState",formatter:(e,a,l)=>({1:"待审批",2:"审批中",3:"审批拒绝",4:"审批通过",5:"作废"}[l])}]),R=i({applyType:[{required:!0,message:"请选择休假类型",trigger:"change"}],startTime:[{type:"date",required:!0,message:"请选择开始日期",trigger:"change"}],endTime:[{type:"date",required:!0,message:"请选择结束日期",trigger:"change"}],reasons:[{required:!0,message:"请输入休假原因",trigger:"change"}]});s((()=>{X()}));const W=e=>{p.pageNum=e,X()},X=async()=>{let e=d(d({},o),p);try{const{list:a,page:l}=await k.getApplyList(e);r.value=a,p.total=l.total}catch(a){console.log(a)}},Y=()=>{G.value=!0,B.value="create"},Z=e=>{e.resetFields()},ee=()=>{G.value=!1,Z(K.value)},ae=e=>{let{startTime:a,endTime:l}=I;a&&l&&(a>l?(S({message:"开始日期不能晚于结束日期",type:"error"}),I.leaveTime="0天",I[e]=""):I.leaveTime=(l-a)/864e5+1+"天")},le=()=>{K.value.validate((async e=>{if(e)try{let e=(t=d({},I),o={action:B.value},a(t,l(o)));await k.applySubmit(e)&&(S({message:"申请已上交",duration:2e3,type:"success"}),G.value=!1,Z(K.value),I.leaveTime="0天",X())}catch(r){console.log(r)}var t,o}))};return(e,a)=>{const l=n("el-option"),i=n("el-select"),u=n("el-form-item"),s=n("el-button"),x=n("el-form"),B=n("el-table-column"),te=n("el-table"),oe=n("el-pagination"),re=n("el-date-picker"),pe=n("el-config-provider"),de=n("el-col"),ie=n("el-row"),ue=n("el-input"),se=n("el-dialog"),ne=n("el-step"),me=n("el-steps");return m(),c("div",D,[y(" 查询申请区域 "),f("div",j,[b(x,{inline:!0,model:v(o),ref:J},{default:g((()=>[b(u,null,{default:g((()=>[b(i,{modelValue:v(o).applyState,"onUpdate:modelValue":a[0]||(a[0]=e=>v(o).applyState=e),label:"审批状态",prop:"applyState"},{default:g((()=>[b(l,{value:"",label:"全部"}),b(l,{value:1,label:"待审批"}),b(l,{value:2,label:"审批中"}),b(l,{value:3,label:"审批拒绝"}),b(l,{value:4,label:"审批通过"}),b(l,{value:5,label:"作废"})])),_:1},8,["modelValue"])])),_:1}),b(u,null,{default:g((()=>[b(s,{type:"primary",onClick:X},{default:g((()=>[N])),_:1}),b(s,{onClick:a[1]||(a[1]=()=>Z(J.value))},{default:g((()=>[O])),_:1})])),_:1})])),_:1},8,["model"])]),y(" 申请列表区域 "),f("div",U,[y(" 申请按钮 "),f("div",M,[b(s,{type:"primary",onClick:Y},{default:g((()=>[z])),_:1})]),b(te,{"max-height":"350",data:r.value},{default:g((()=>[(m(!0),c(_,null,T(v(Q),(e=>(m(),h(B,{key:e.prop,prop:e.prop,label:e.label,width:e.width,formatter:e.formatter,align:e.align},null,8,["prop","label","width","formatter","align"])))),128)),b(B,{label:"操作",width:"150"},{default:g((e=>[b(s,{size:"mini",plain:"",onClick:a=>(e=>{H.value=!0;let a=d({},e);a.applyTypeName={1:"事假",2:"调休",3:"年假"}[a.applyType],a.time=`${C.formateDate(new Date(a.startTime),"yyyy-MM-dd")}到${C.formateDate(new Date(a.endTime),"yyyy-MM-dd")}`,a.applyStateName={1:"待审批",2:"审批中",3:"审批拒绝",4:"审批通过",5:"作废"}[a.applyState],Object.assign(L,a)})(e.row)},{default:g((()=>[q])),_:2},1032,["onClick"]),e.row.applyState>2?y("v-if",!0):(m(),h(s,{key:0,type:"danger",size:"mini",onClick:a=>(async e=>{try{await k.applySubmit({_id:e,action:"delete"})&&(S({message:"删除成功",duration:2e3,type:"success"}),X())}catch(a){console.log(a)}})(e.row._id)},{default:g((()=>[P])),_:2},1032,["onClick"]))])),_:1})])),_:1},8,["data"]),b(oe,{class:"pagination",layout:"prev, pager, next",total:v(p).total,"page-size":v(p).pageSize,onCurrentChange:W},null,8,["total","page-size"])]),y(" 休假申请表单 "),b(se,{title:"休假申请",modelValue:G.value,"onUpdate:modelValue":a[8]||(a[8]=e=>G.value=e),"close-on-click-modal":!1,"show-close":!1,"close-on-press-escape":!1,center:!0,width:"700px"},{footer:g((()=>[f("span",$,[b(s,{onClick:ee},{default:g((()=>[F])),_:1}),b(s,{type:"primary",onClick:le},{default:g((()=>[E])),_:1})])])),default:g((()=>[b(x,{ref:K,model:v(I),"label-width":"100px",rules:v(R)},{default:g((()=>[b(u,{label:"休假类型",prop:"applyType"},{default:g((()=>[b(i,{modelValue:v(I).applyType,"onUpdate:modelValue":a[2]||(a[2]=e=>v(I).applyType=e),placeholder:"请选择休假类型"},{default:g((()=>[b(l,{value:1,label:"事假"}),b(l,{value:2,label:"调休"}),b(l,{value:3,label:"年假"})])),_:1},8,["modelValue"])])),_:1}),b(u,{label:"休假时间",required:""},{default:g((()=>[b(ie,null,{default:g((()=>[b(de,{span:10},{default:g((()=>[b(u,{prop:"startTime",style:{"margin-bottom":"0px"}},{default:g((()=>[b(pe,{locale:v(t)},{default:g((()=>[b(re,{modelValue:v(I).startTime,"onUpdate:modelValue":a[3]||(a[3]=e=>v(I).startTime=e),type:"date",placeholder:"选择开始日期",onChange:a[4]||(a[4]=()=>ae("startTime"))},null,8,["modelValue"])])),_:1},8,["locale"])])),_:1})])),_:1}),b(de,{span:1,class:"middle-gap"},{default:g((()=>[A])),_:1}),b(de,{span:10},{default:g((()=>[b(u,{prop:"endTime",style:{"margin-bottom":"0px"}},{default:g((()=>[b(pe,{locale:v(t)},{default:g((()=>[b(re,{modelValue:v(I).endTime,"onUpdate:modelValue":a[5]||(a[5]=e=>v(I).endTime=e),type:"date",placeholder:"选择结束日期",onChange:a[6]||(a[6]=()=>ae("endTime"))},null,8,["modelValue"])])),_:1},8,["locale"])])),_:1})])),_:1})])),_:1})])),_:1}),b(u,{label:"休假时长"},{default:g((()=>[w(V(v(I).leaveTime),1)])),_:1}),b(u,{label:"休假原因",prop:"reasons"},{default:g((()=>[b(ue,{type:"textarea",row:3,placeholder:"请输入休假原因",modelValue:v(I).reasons,"onUpdate:modelValue":a[7]||(a[7]=e=>v(I).reasons=e)},null,8,["modelValue"])])),_:1})])),_:1},8,["model","rules"])])),_:1},8,["modelValue"]),y(" 休假申请详情表单 "),b(se,{title:"休假申请详情",modelValue:H.value,"onUpdate:modelValue":a[9]||(a[9]=e=>H.value=e),center:!0,width:"700px"},{default:g((()=>[b(me,{active:v(L).applyState>2?3:v(L).applyState,"align-center":""},{default:g((()=>[b(ne,{title:"待审批"}),b(ne,{title:"审批中"}),b(ne,{title:"审批通过/审批拒绝"})])),_:1},8,["active"]),b(x,{"label-width":"100px","label-suffix":":"},{default:g((()=>[b(u,{label:"休假类型"},{default:g((()=>[f("div",null,V(v(L).applyTypeName),1)])),_:1}),b(u,{label:"休假时间"},{default:g((()=>[f("div",null,V(v(L).time),1)])),_:1}),b(u,{label:"休假时长"},{default:g((()=>[f("div",null,V(v(L).leaveTime),1)])),_:1}),b(u,{label:"休假原因"},{default:g((()=>[f("div",null,V(v(L).reasons),1)])),_:1}),b(u,{label:"审批状态"},{default:g((()=>[f("div",null,V(v(L).applyStateName),1)])),_:1}),b(u,{label:"审批人"},{default:g((()=>[f("div",null,V(v(L).curAuditUserName),1)])),_:1})])),_:1})])),_:1},8,["modelValue"])])}}};export{I as default};