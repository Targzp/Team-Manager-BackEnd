var e=Object.defineProperty,l=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,t=Object.prototype.propertyIsEnumerable,o=(l,a,t)=>a in l?e(l,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[a]=t,u=(e,u)=>{for(var r in u||(u={}))a.call(u,r)&&o(e,r,u[r]);if(l)for(var r of l(u))t.call(u,r)&&o(e,r,u[r]);return e};import{M as r,A as d,C as s,r as i,O as p,o as n,c as m,d as c,e as b,w as f,N as v,P as g,F as y,a as V,b as w,f as _,_ as h,R as I,J as k}from"./vendor.b1d65a4d.js";import{u as C,a as N}from"./index.605a31b6.js";const U={class:"user-manager"},j={class:"query-form"},D=_("查询"),O=_("重置"),L={class:"base-table"},z={class:"action"},E=_("新增"),S=_("批量删除"),x=_("编辑"),P=_("删除"),q={class:"dialog-footer"},F=_("取 消"),M=_("确 定"),R={setup(e){const l=r({state:1}),a=d([]),t=r({pageNum:1,pageSize:10}),o=d([]),_=r({state:1}),R=d([]),T=d([]),$=d("add"),A=r({userName:[{required:!0,message:"请输入用户名称",trigger:"blur"}],userEmail:[{required:!0,message:"请输入用户邮箱",trigger:"blur"},{pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,message:"请输入正确的邮箱格式"}],mobile:[{pattern:/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,message:"请输入正确的手机号格式"}]}),J=d(!1),B=d(null),G=d(null),H=r([{label:"用户ID",prop:"userId",width:"100"},{label:"用户名称",prop:"userName",width:"100"},{label:"用户邮箱",prop:"userEmail",width:"150"},{label:"用户角色",prop:"role",formatter:(e,l,a)=>({0:"管理员",1:"普通用户"}[a]),width:"100"},{label:"用户状态",prop:"state",formatter:(e,l,a)=>({1:"在职",2:"离职",3:"试用期"}[a]),width:"100"},{label:"注册时间",prop:"createTime",formatter:(e,l,a)=>C.formateDate(new Date(a))},{label:"最后登录时间",prop:"lastLoginTime",formatter:(e,l,a)=>C.formateDate(new Date(a))}]);s((()=>{K(),le(),ae()}));const K=async()=>{let e=u(u({},l),t);try{const{list:l,page:o}=await N.getUserList(e);a.value=l,t.total=o.total}catch(o){console.log(o)}},Q=()=>{K()},W=e=>{e.resetFields()},X=e=>{console.log(e),t.pageNum=e,K()},Y=async()=>{if(0==o.value.length)return void h({message:"未选中要删除的用户",type:"error"});(await N.userDel({userIds:o.value})).nModified>0?(h({message:"删除成功",type:"success"}),K()):h({message:"删除失败",type:"error"})},Z=e=>{let l=[];e.map((e=>{l.push(e.userId)})),o.value=l},ee=()=>{J.value=!0},le=async()=>{let e=await N.getDeptList();T.value=e},ae=async()=>{let e=await N.getRoleNameList();R.value=e},te=()=>{J.value=!1,$.value="add",W(G.value)},oe=()=>{G.value.validate((async e=>{if(e){let e=I(_);e.action=$.value;await N.userSubmit(e)&&(h({message:"edit"==$.value?"更新成功":"用户创建成功",duration:2e3,type:"success"}),J.value=!1,$.value="add",W(G.value),K())}}))};return(e,o)=>{const u=i("el-input"),r=i("el-form-item"),d=i("el-option"),s=i("el-select"),I=i("el-button"),C=i("el-form"),le=i("el-table-column"),ae=i("el-table"),ue=i("el-pagination"),re=i("el-cascader"),de=i("el-dialog"),se=p("has");return n(),m("div",U,[c("div",j,[b(C,{inline:!0,model:v(l),ref:B},{default:f((()=>[b(r,{label:"用户ID",prop:"userId"},{default:f((()=>[b(u,{modelValue:v(l).userId,"onUpdate:modelValue":o[0]||(o[0]=e=>v(l).userId=e),placeholder:"请输入用户ID"},null,8,["modelValue"])])),_:1}),b(r,{label:"用户名称",prop:"userName"},{default:f((()=>[b(u,{modelValue:v(l).userName,"onUpdate:modelValue":o[1]||(o[1]=e=>v(l).userName=e),placeholder:"请输入用户名称"},null,8,["modelValue"])])),_:1}),b(r,null,{default:f((()=>[b(s,{modelValue:v(l).state,"onUpdate:modelValue":o[2]||(o[2]=e=>v(l).state=e),label:"用户状态",prop:"state"},{default:f((()=>[b(d,{value:0,label:"所有"}),b(d,{value:1,label:"在职"}),b(d,{value:2,label:"离职"}),b(d,{value:3,label:"试用期"})])),_:1},8,["modelValue"])])),_:1}),b(r,null,{default:f((()=>[b(I,{type:"primary",onClick:Q},{default:f((()=>[D])),_:1}),b(I,{onClick:o[3]||(o[3]=()=>W(B.value))},{default:f((()=>[O])),_:1})])),_:1})])),_:1},8,["model"])]),c("div",L,[c("div",z,[g(b(I,{type:"primary",onClick:ee},{default:f((()=>[E])),_:1},512),[[se,"user-create"]]),g(b(I,{type:"danger",onClick:Y},{default:f((()=>[S])),_:1},512),[[se,"user-patch-delete"]])]),b(ae,{"max-height":"350",data:a.value,onSelectionChange:Z},{default:f((()=>[b(le,{type:"selection"}),(n(!0),m(y,null,V(v(H),(e=>(n(),w(le,{key:e.prop,prop:e.prop,label:e.label,width:e.width,formatter:e.formatter},null,8,["prop","label","width","formatter"])))),128)),b(le,{label:"操作",width:"150"},{default:f((e=>[g(b(I,{size:"mini",plain:"",onClick:l=>(async e=>{$.value="edit",J.value=!0,await k(),Object.assign(_,e)})(e.row)},{default:f((()=>[x])),_:2},1032,["onClick"]),[[se,"user-edit"]]),g(b(I,{type:"danger",size:"mini",onClick:l=>(async e=>{await N.userDel({userIds:[e.userId]}),h({message:"删除成功",type:"success"}),K()})(e.row)},{default:f((()=>[P])),_:2},1032,["onClick"]),[[se,"user-delete"]])])),_:1})])),_:1},8,["data"]),b(ue,{class:"pagination",layout:"prev, pager, next",total:v(t).total,"page-size":v(t).pageSize,onCurrentChange:X},null,8,["total","page-size"])]),b(de,{title:"edit"==$.value?"用户编辑":"用户新增",modelValue:J.value,"onUpdate:modelValue":o[11]||(o[11]=e=>J.value=e),"close-on-click-modal":!1,"show-close":!1,"close-on-press-escape":!1,center:!0},{footer:f((()=>[c("span",q,[b(I,{onClick:te},{default:f((()=>[F])),_:1}),b(I,{type:"primary",onClick:oe},{default:f((()=>[M])),_:1})])])),default:f((()=>[b(C,{ref:G,model:v(_),"label-width":"100px",rules:v(A)},{default:f((()=>[b(r,{label:"用户名",prop:"userName"},{default:f((()=>[b(u,{modelValue:v(_).userName,"onUpdate:modelValue":o[4]||(o[4]=e=>v(_).userName=e),disabled:"edit"==$.value,placeholder:"请输入用户名称"},null,8,["modelValue","disabled"])])),_:1}),b(r,{label:"邮箱",prop:"userEmail"},{default:f((()=>[b(u,{modelValue:v(_).userEmail,"onUpdate:modelValue":o[5]||(o[5]=e=>v(_).userEmail=e),disabled:"edit"==$.value,placeholder:"请输入用户邮箱"},null,8,["modelValue","disabled"])])),_:1}),b(r,{label:"手机号",prop:"mobile"},{default:f((()=>[b(u,{modelValue:v(_).mobile,"onUpdate:modelValue":o[6]||(o[6]=e=>v(_).mobile=e),placeholder:"请输入手机号"},null,8,["modelValue"])])),_:1}),b(r,{label:"岗位",prop:"job"},{default:f((()=>[b(u,{modelValue:v(_).job,"onUpdate:modelValue":o[7]||(o[7]=e=>v(_).job=e),placeholder:"请输入岗位"},null,8,["modelValue"])])),_:1}),b(r,{label:"状态",prop:"state"},{default:f((()=>[b(s,{modelValue:v(_).state,"onUpdate:modelValue":o[8]||(o[8]=e=>v(_).state=e)},{default:f((()=>[b(d,{value:1,label:"在职"}),b(d,{value:2,label:"离职"}),b(d,{value:3,label:"试用期"})])),_:1},8,["modelValue"])])),_:1}),b(r,{label:"系统角色",prop:"roleList"},{default:f((()=>[b(s,{multiple:"",modelValue:v(_).roleList,"onUpdate:modelValue":o[9]||(o[9]=e=>v(_).roleList=e),placeholder:"请选择用户角色"},{default:f((()=>[(n(!0),m(y,null,V(R.value,(e=>(n(),w(d,{key:e._id,value:e._id,label:e.roleName},null,8,["value","label"])))),128))])),_:1},8,["modelValue"])])),_:1}),b(r,{label:"部门",prop:"deptId"},{default:f((()=>[b(re,{modelValue:v(_).deptId,"onUpdate:modelValue":o[10]||(o[10]=e=>v(_).deptId=e),placeholder:"请选择所属部门",options:T.value,props:{checkStrictly:!0,value:"_id",label:"deptName"},clearable:""},null,8,["modelValue","options"])])),_:1})])),_:1},8,["model","rules"])])),_:1},8,["title","modelValue"])])}}};export{R as default};