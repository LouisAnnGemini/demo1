import React, { useState } from 'react';
import { allStaffs, orgTree, auditTasks, rosterLogs, transferAuditDetails, flatTransferLogs } from '../data/mock';
import { Network, Users, ClipboardCheck, FileText, History, Search, Plus, Upload, ChevronDown, ChevronRight, X, RefreshCw, Paperclip, CheckCircle, XCircle, UserX, MoreVertical, RotateCcw } from 'lucide-react';

export default function AdminView() {
  const [activeTab, setActiveTab] = useState('staff_list');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'entity_1', 'floor_1', 'area_1']));
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isEditingQuota, setIsEditingQuota] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [staffFilters, setStaffFilters] = useState({ name: '', id: '', type: '', role: '', entity: '', brand: '', status: '', startDate: '', endDate: '' });
  const [appliedStaffFilters, setAppliedStaffFilters] = useState({ name: '', id: '', type: '', role: '', entity: '', brand: '', status: '', startDate: '', endDate: '' });
  const [auditFilters, setAuditFilters] = useState({ targetPerson: '', type: '', startDate: '', endDate: '', applicant: '', status: '' });
  const [appliedAuditFilters, setAppliedAuditFilters] = useState({ targetPerson: '', type: '', startDate: '', endDate: '', applicant: '', status: '' });
  const [selectedAuditIds, setSelectedAuditIds] = useState<string[]>([]);
  const [unblacklistStaff, setUnblacklistStaff] = useState<any>(null);
  const [unblacklistReason, setUnblacklistReason] = useState('');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [auditSubTab, setAuditSubTab] = useState('pending');

  // Close action menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setOpenActionMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Reset audit filters when switching between audit center and logs
  React.useEffect(() => {
    if (activeTab === 'transfer_audit') {
      if (auditSubTab === 'logs') {
        setAuditFilters(prev => ({ ...prev, status: '' }));
        setAppliedAuditFilters(prev => ({ ...prev, status: '' }));
      } else {
        setAuditFilters(prev => ({ ...prev, status: '待审核' }));
        setAppliedAuditFilters(prev => ({ ...prev, status: '待审核' }));
      }
    }
  }, [activeTab, auditSubTab]);

  const filteredStaffs = allStaffs.filter(s => {
    if (appliedStaffFilters.name && !s.name.includes(appliedStaffFilters.name)) return false;
    if (appliedStaffFilters.id && !s.id.includes(appliedStaffFilters.id)) return false;
    if (appliedStaffFilters.type && s.type !== appliedStaffFilters.type) return false;
    if (appliedStaffFilters.role && (!s.tags || !s.tags.includes(appliedStaffFilters.role))) return false;
    if (appliedStaffFilters.entity && s.entity !== appliedStaffFilters.entity) return false;
    if (appliedStaffFilters.brand && !s.brand.includes(appliedStaffFilters.brand)) return false;
    if (appliedStaffFilters.status && s.status !== appliedStaffFilters.status) return false;
    return true;
  });

  const filteredAudits = auditTasks.filter(audit => {
    if (appliedAuditFilters.targetPerson && !audit.targetPerson.includes(appliedAuditFilters.targetPerson)) return false;
    if (appliedAuditFilters.type && audit.type !== appliedAuditFilters.type) return false;
    if (appliedAuditFilters.startDate && audit.applyTime < appliedAuditFilters.startDate) return false;
    if (appliedAuditFilters.endDate && audit.applyTime > appliedAuditFilters.endDate + ' 23:59:59') return false;
    if (appliedAuditFilters.applicant && !audit.applicant.includes(appliedAuditFilters.applicant)) return false;
    if (appliedAuditFilters.status && audit.status !== appliedAuditFilters.status) return false;
    return true;
  });

  const handleSelectAllAudits = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAuditIds(filteredAudits.map(a => a.id));
    } else {
      setSelectedAuditIds([]);
    }
  };

  const handleSelectAudit = (id: string) => {
    setSelectedAuditIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredTransferLogs = flatTransferLogs.filter(log => {
    if (appliedStaffFilters.name && !log.applicant.includes(appliedStaffFilters.name)) return false;
    if (appliedStaffFilters.type && log.type !== appliedStaffFilters.type) return false;
    if (appliedStaffFilters.entity && !log.path.includes(appliedStaffFilters.entity)) return false;
    if (appliedStaffFilters.brand && !log.path.includes(appliedStaffFilters.brand)) return false;
    if (appliedStaffFilters.status && log.result !== appliedStaffFilters.status) return false;
    return true;
  });

  const filteredRosterLogs = rosterLogs.filter(log => {
    if (appliedStaffFilters.name && !log.employee.includes(appliedStaffFilters.name)) return false;
    if (appliedStaffFilters.id && !log.employee.includes(appliedStaffFilters.id)) return false;
    if (appliedStaffFilters.type && log.type !== appliedStaffFilters.type) return false;
    if (appliedStaffFilters.startDate && log.time < appliedStaffFilters.startDate) return false;
    if (appliedStaffFilters.endDate && log.time > appliedStaffFilters.endDate + ' 23:59:59') return false;
    return true;
  });

  const filteredBlacklist = allStaffs.filter(s => s.isBlacklisted).filter(s => {
    if (appliedStaffFilters.name && !s.name.includes(appliedStaffFilters.name)) return false;
    if (appliedStaffFilters.id && !s.id.includes(appliedStaffFilters.id)) return false;
    if (appliedStaffFilters.type && s.type !== appliedStaffFilters.type) return false;
    if (appliedStaffFilters.role && (!s.tags || !s.tags.includes(appliedStaffFilters.role))) return false;
    if (appliedStaffFilters.entity && s.entity !== appliedStaffFilters.entity) return false;
    if (appliedStaffFilters.brand && !s.brand.includes(appliedStaffFilters.brand)) return false;
    return true;
  });

  const activeActionStaff = allStaffs.find(s => s.id === openActionMenuId);

  const toggleNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(expandedNodes);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedNodes(newSet);
  };

  const renderTree = (node: any, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;

    return (
      <div key={node.id} className="mb-1 text-sm select-none">
        <div 
          className={`flex items-center py-2 px-3 rounded-lg cursor-pointer group transition-colors ${isSelected ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedNode(node);
            if (hasChildren && !isExpanded) {
              toggleNode(node.id, e);
            }
          }}
        >
          <span style={{ width: level * 24 }} className="inline-block shrink-0"></span>
          <span 
            className="w-5 shrink-0 flex items-center justify-center text-gray-400 group-hover:text-blue-500"
            onClick={(e) => {
              if (hasChildren) toggleNode(node.id, e);
            }}
          >
            {hasChildren ? (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : null}
          </span>
          <span className={`font-medium transition-colors ${isSelected ? 'text-blue-800' : 'text-gray-700 group-hover:text-blue-700'}`}>{node.name}</span>
          <span className={`ml-3 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${isSelected ? 'bg-blue-200 text-blue-800' : 'text-blue-600 bg-blue-100'}`}>{node.level}</span>
          {node.quotaTotal !== undefined && (
            <span className={`ml-auto text-xs font-medium px-2 py-1 rounded border shadow-sm ${isSelected ? 'bg-white border-blue-200 text-gray-600' : 'bg-white border-gray-200 text-gray-500'}`}>
              定编: <span className={node.quotaUsed >= node.quotaTotal ? 'text-red-500' : 'text-blue-600'}>{node.quotaUsed}</span> / {node.quotaTotal}
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="border-l-2 border-dashed border-gray-200 ml-[13px] mt-1 mb-2">
            {node.children.map((child: any) => renderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderStaffFilterBar = () => {
    if (activeTab === 'roster') {
      return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end mb-6">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-600">姓名</label>
            <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入" value={staffFilters.name} onChange={e => setStaffFilters({...staffFilters, name: e.target.value})} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-600">工号</label>
            <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入" value={staffFilters.id} onChange={e => setStaffFilters({...staffFilters, id: e.target.value})} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-600">变动类型</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={staffFilters.type} onChange={e => setStaffFilters({...staffFilters, type: e.target.value})}>
              <option value="">全部</option>
              <option value="注册">注册</option>
              <option value="通过审核">通过审核</option>
              <option value="未通过审核">未通过审核</option>
              <option value="入职">入职</option>
              <option value="解编">解编</option>
              <option value="绑编">绑编</option>
              <option value="离职">离职</option>
              <option value="拉黑">拉黑</option>
            </select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-600">开始时间</label>
            <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500" value={staffFilters.startDate} onChange={e => setStaffFilters({...staffFilters, startDate: e.target.value})} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-600">结束时间</label>
            <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500" value={staffFilters.endDate} onChange={e => setStaffFilters({...staffFilters, endDate: e.target.value})} />
          </div>
          <div className="flex space-x-3 ml-auto">
            <button onClick={() => { setStaffFilters({name:'', id:'', type:'', role:'', entity:'', brand:'', status:'', startDate:'', endDate:''}); setAppliedStaffFilters({name:'', id:'', type:'', role:'', entity:'', brand:'', status:'', startDate:'', endDate:''}); }} className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 font-bold transition-colors">重置</button>
            <button onClick={() => setAppliedStaffFilters(staffFilters)} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-bold flex items-center transition-colors shadow-sm">
              <Search size={16} className="mr-1.5" /> 搜索
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end mb-6">
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-gray-600">姓名</label>
          <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入" value={staffFilters.name} onChange={e => setStaffFilters({...staffFilters, name: e.target.value})} />
        </div>
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-gray-600">工号</label>
          <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入" value={staffFilters.id} onChange={e => setStaffFilters({...staffFilters, id: e.target.value})} />
        </div>
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-gray-600">类型</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={staffFilters.type} onChange={e => setStaffFilters({...staffFilters, type: e.target.value})}>
            <option value="">全部</option>
            <option value="正式">正式</option>
            <option value="厂聘">厂聘</option>
            <option value="临时">临时</option>
          </select>
        </div>
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-gray-600">角色</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={staffFilters.role} onChange={e => setStaffFilters({...staffFilters, role: e.target.value})}>
            <option value="">全部</option>
            <option value="普通人员">普通人员</option>
            <option value="店长">店长</option>
          </select>
        </div>
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-gray-600">所属实体</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-40 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={staffFilters.entity} onChange={e => setStaffFilters({...staffFilters, entity: e.target.value})}>
            <option value="">全部</option>
            <option value="集团总部">集团总部</option>
            <option value="黄石武商MALL">黄石武商MALL</option>
            <option value="武商MALL">武商MALL</option>
          </select>
        </div>
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-gray-600">所属品牌</label>
          <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入" value={staffFilters.brand} onChange={e => setStaffFilters({...staffFilters, brand: e.target.value})} />
        </div>
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-gray-600">状态</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={staffFilters.status} onChange={e => setStaffFilters({...staffFilters, status: e.target.value})}>
            <option value="">全部</option>
            <option value="未注册">未注册</option>
            <option value="未审核">未审核</option>
            <option value="已审核">已审核</option>
            <option value="已入职">已入职</option>
            <option value="已离职">已离职</option>
          </select>
        </div>
        <div className="flex space-x-3 ml-auto">
          <button onClick={() => { setStaffFilters({name:'', id:'', type:'', role:'', entity:'', brand:'', status:'', startDate:'', endDate:''}); setAppliedStaffFilters({name:'', id:'', type:'', role:'', entity:'', brand:'', status:'', startDate:'', endDate:''}); }} className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 font-bold transition-colors">重置</button>
          <button onClick={() => setAppliedStaffFilters(staffFilters)} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-bold flex items-center transition-colors shadow-sm">
            <Search size={16} className="mr-1.5" /> 搜索
          </button>
        </div>
      </div>
    );
  };

  const renderAuditFilterBar = (isLogsTab = false) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end mb-6">
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold text-gray-600">操作对象</label>
        <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="姓名或工号" value={auditFilters.targetPerson} onChange={e => setAuditFilters({...auditFilters, targetPerson: e.target.value})} />
      </div>
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold text-gray-600">操作类型</label>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={auditFilters.type} onChange={e => setAuditFilters({...auditFilters, type: e.target.value})}>
          <option value="">全部</option>
          <option value="注册">注册</option>
          <option value="入职">入职</option>
          <option value="解编">解编</option>
          <option value="绑编">绑编</option>
          <option value="离职">离职</option>
          <option value="拉黑">拉黑</option>
        </select>
      </div>
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold text-gray-600">申请时间(起)</label>
        <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500" value={auditFilters.startDate} onChange={e => setAuditFilters({...auditFilters, startDate: e.target.value})} />
      </div>
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold text-gray-600">申请时间(止)</label>
        <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500" value={auditFilters.endDate} onChange={e => setAuditFilters({...auditFilters, endDate: e.target.value})} />
      </div>
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold text-gray-600">申请人</label>
        <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="姓名或工号" value={auditFilters.applicant} onChange={e => setAuditFilters({...auditFilters, applicant: e.target.value})} />
      </div>
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold text-gray-600">状态</label>
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={auditFilters.status} onChange={e => setAuditFilters({...auditFilters, status: e.target.value})}>
          <option value="">全部</option>
          {!isLogsTab && <option value="待审核">待审核</option>}
          <option value="已通过">已通过</option>
          <option value="已驳回">已驳回</option>
        </select>
      </div>
      <div className="flex space-x-3 ml-auto">
        <button onClick={() => { 
          const defaultStatus = isLogsTab ? '' : '待审核';
          setAuditFilters({targetPerson:'', type:'', startDate:'', endDate:'', applicant:'', status: defaultStatus}); 
          setAppliedAuditFilters({targetPerson:'', type:'', startDate:'', endDate:'', applicant:'', status: defaultStatus}); 
        }} className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 font-bold transition-colors">重置</button>
        <button onClick={() => setAppliedAuditFilters(auditFilters)} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-bold flex items-center transition-colors shadow-sm">
          <Search size={16} className="mr-1.5" /> 搜索
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto bg-white shadow-2xl overflow-hidden flex min-h-screen border-x border-gray-200">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 pb-8">
          <h1 className="text-xl font-bold tracking-tight text-blue-400">厂聘管理系统</h1>
          <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-widest font-bold opacity-80">Admin Console V3.0</p>
        </div>
        <nav className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-6">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-6">员工管理</h3>
            <div className="px-4 space-y-1">
              <button
                onClick={() => setActiveTab('staff_list')}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'staff_list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users size={18} className={`mr-3 ${activeTab === 'staff_list' ? 'opacity-100' : 'opacity-70'}`} />
                员工列表
              </button>
              <button
                onClick={() => setActiveTab('roster')}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'roster' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <History size={18} className={`mr-3 ${activeTab === 'roster' ? 'opacity-100' : 'opacity-70'}`} />
                员工花名册
              </button>
              <button
                onClick={() => setActiveTab('transfer_audit')}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'transfer_audit' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ClipboardCheck size={18} className={`mr-3 ${activeTab === 'transfer_audit' ? 'opacity-100' : 'opacity-70'}`} />
                审核中心
              </button>
              <button
                onClick={() => setActiveTab('blacklist')}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'blacklist' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <UserX size={18} className={`mr-3 ${activeTab === 'blacklist' ? 'opacity-100' : 'opacity-70'}`} />
                黑名单列表
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-6">组织架构</h3>
            <div className="px-4 space-y-1">
              <button
                onClick={() => setActiveTab('dept')}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'dept' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Network size={18} className={`mr-3 ${activeTab === 'dept' ? 'opacity-100' : 'opacity-70'}`} />
                部门管理
              </button>
            </div>
          </div>
        </nav>
        <div className="p-5 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div>
              <p className="text-xs font-medium text-white">高级管理员</p>
              <p className="text-[10px] text-slate-500 mt-0.5">系统运维</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shrink-0 z-10">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            {activeTab === 'dept' && '部门管理'}
            {activeTab === 'staff_list' && '员工列表'}
            {activeTab === 'transfer_audit' && '审核中心'}
            {activeTab === 'roster' && '员工花名册'}
            {activeTab === 'blacklist' && '黑名单列表'}
          </h2>
          <div className="flex items-center space-x-4">
            {/* Search input removed as requested */}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          
          {/* 1. 部门管理 */}
          {activeTab === 'dept' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto h-full">
              <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-[750px]">
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <h3 className="font-bold text-gray-800 text-lg">组织架构树 (五级: 集团-实体-楼层-区域-品牌)</h3>
                  <div className="flex space-x-2">
                    <button className="text-gray-600 text-xs font-bold hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center transition-colors shadow-sm">
                      <RefreshCw size={12} className="mr-1.5" /> 从MIS同步
                    </button>
                    <button className="text-blue-600 text-xs font-bold hover:bg-blue-100 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors shadow-sm">+ 新增节点</button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {Array.isArray(orgTree) ? orgTree.map(node => renderTree(node)) : renderTree(orgTree)}
                </div>
              </div>
              
              <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-[750px]">
                {selectedNode ? (
                  <>
                    <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{selectedNode.name}</h3>
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded mt-2 inline-block font-bold tracking-wider">{selectedNode.level}</span>
                      </div>
                      {selectedNode.level === '品牌' && (
                        <button 
                          onClick={() => setIsEditingQuota(true)} 
                          className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 font-medium text-gray-700 transition-colors"
                        >
                          编辑定编
                        </button>
                      )}
                    </div>

                    {selectedNode.level === '品牌' && (
                      <div className="mb-6 space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex justify-between text-xs font-bold text-gray-700 mb-3">
                            <span>定编使用情况</span>
                            <span><span className={selectedNode.quotaUsed >= selectedNode.quotaTotal ? 'text-red-600' : 'text-blue-600'}>{selectedNode.quotaUsed || 0}</span> / {selectedNode.quotaTotal || 0}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`${selectedNode.quotaUsed >= selectedNode.quotaTotal ? 'bg-red-500' : 'bg-blue-500'} h-full rounded-full transition-all duration-500`} 
                              style={{ width: `${Math.min(((selectedNode.quotaUsed || 0) / (selectedNode.quotaTotal || 1)) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">MIS 同步信息</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">所属实体:</span> <span className="font-medium">{selectedNode.entity}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">品牌名称:</span> <span className="font-medium">{selectedNode.name}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">品牌编号:</span> <span className="font-mono">{selectedNode.code}</span></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex-1 flex flex-col min-h-0">
                      <h4 className="font-bold text-sm text-gray-800 mb-4 flex items-center">
                        下属人员
                        {selectedNode.level === '品牌' && (
                          <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                            {allStaffs.filter(s => s.brand === selectedNode.name && s.status !== '已离职').length}
                          </span>
                        )}
                      </h4>
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                        {selectedNode.level === '品牌' ? (
                          (() => {
                            const deptStaffs = allStaffs.filter(s => s.brand === selectedNode.name && s.status !== '已离职');
                            return deptStaffs.length > 0 ? deptStaffs.map(s => (
                              <div 
                                key={s.id} 
                                className="p-3 border border-gray-100 rounded-lg flex items-center justify-between hover:bg-blue-50/50 transition-colors cursor-pointer group" 
                                onClick={() => setSelectedStaff(s)}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    {s.name.slice(0, 1)}
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{s.name}</span>
                                      {s.tags?.includes('店长') && (
                                        <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded">店长</span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono mt-0.5">{s.id} · {s.type}</div>
                                  </div>
                                </div>
                                <div className="text-right flex flex-col items-end space-y-1">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                    s.status === '已入职' ? 'bg-green-100 text-green-600' :
                                    s.status === '已审核' ? 'bg-blue-100 text-blue-600' :
                                    s.status === '未审核' ? 'bg-orange-100 text-orange-600' :
                                    s.status === '已离职' ? 'bg-gray-200 text-gray-600' :
                                    'bg-slate-100 text-slate-500'
                                  }`}>
                                    {s.status}
                                  </span>
                                  <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">点击查看详情</span>
                                </div>
                              </div>
                            )) : (
                              <div className="text-center py-8 text-sm text-gray-400">
                                暂无人员
                              </div>
                            );
                          })()
                        ) : (
                          <div className="text-center py-8 text-sm text-gray-400">
                            请选择品牌层级查看具体人员
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <Network size={48} className="mb-4 opacity-20" />
                    <p className="text-sm font-medium">请在左侧选择组织架构节点</p>
                    <p className="text-xs mt-2 opacity-70">选择品牌层级可查看和配置定编</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2.1 员工列表 */}
          {activeTab === 'staff_list' && (
            <div className="space-y-6 max-w-[1500px] mx-auto">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-500">展示所有员工详细信息</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center shadow-sm">
                    <Upload size={16} className="mr-2" /> 导出列表
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center shadow-sm">
                    <Plus size={16} className="mr-2" /> 新增员工
                  </button>
                </div>
              </div>

              {/* 搜索筛选区 */}
              {renderStaffFilterBar()}
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar pb-2">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-4">姓名</th>
                        <th className="px-4 py-4">手机号</th>
                        <th className="px-4 py-4">工号</th>
                        <th className="px-4 py-4">类型</th>
                        <th className="px-4 py-4">角色</th>
                        <th className="px-4 py-4">所属实体</th>
                        <th className="px-4 py-4">所属品牌</th>
                        <th className="px-4 py-4">状态</th>
                        <th className="px-4 py-4 text-right sticky right-0 bg-gray-50 shadow-[-4px_0_6px_-1px_rgb(0,0,0,0.05)]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                      {filteredStaffs.length > 0 ? filteredStaffs.map((s, i) => (
                        <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-4 py-4 font-bold text-gray-800">{s.name}</td>
                          <td className="px-4 py-4 font-mono text-gray-600">{s.phone}</td>
                          <td className="px-4 py-4 font-mono font-medium text-gray-600">{s.id}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              s.type === '厂聘' ? 'bg-purple-100 text-purple-700' : 
                              s.type === '正式' ? 'bg-blue-100 text-blue-700' : 
                              'bg-orange-100 text-orange-700'
                            }`}>{s.type}</span>
                          </td>
                          <td className="px-4 py-4 text-gray-700">
                            {s.tags && s.tags.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {s.tags.map((tag, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs border border-gray-200">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            ) : '-'}
                          </td>
                          <td className="px-4 py-4 text-gray-700">{s.entity}</td>
                          <td className="px-4 py-4 text-gray-700">{s.brand}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              s.status === '未注册' ? 'bg-slate-100 text-slate-500' :
                              s.status === '未审核' ? 'bg-orange-100 text-orange-600' :
                              s.status === '已审核' ? 'bg-blue-100 text-blue-600' :
                              s.status === '已入职' ? 'bg-green-100 text-green-600' :
                              'bg-gray-200 text-gray-600'
                            }`}>{s.status}</span>
                          </td>
                          <td className="px-4 py-4 text-right space-x-3 sticky right-0 bg-white group-hover:bg-blue-50/30 shadow-[-4px_0_6px_-1px_rgb(0,0,0,0.05)] transition-colors">
                            <div className="inline-flex items-center relative">
                              <div className="flex items-center border border-blue-200 rounded-md overflow-hidden">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (openActionMenuId === s.id) {
                                      setOpenActionMenuId(null);
                                    } else {
                                      const rect = e.currentTarget.closest('.border-blue-200')?.getBoundingClientRect();
                                      if (rect) {
                                        setMenuPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                                        setOpenActionMenuId(s.id);
                                      }
                                    }
                                  }}
                                  className="px-2 py-1 text-blue-600 hover:bg-blue-50 font-bold text-xs transition-colors"
                                >
                                  编辑
                                </button>
                                <div className="w-[1px] h-4 bg-blue-200"></div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (openActionMenuId === s.id) {
                                      setOpenActionMenuId(null);
                                    } else {
                                      const rect = e.currentTarget.closest('.border-blue-200')?.getBoundingClientRect();
                                      if (rect) {
                                        setMenuPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                                        setOpenActionMenuId(s.id);
                                      }
                                    }
                                  }}
                                  className="px-1 py-1 text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                  <ChevronDown size={14} />
                                </button>
                              </div>
                            </div>
                            <button onClick={() => setSelectedStaff(s)} className="text-gray-400 hover:text-gray-800 font-bold text-xs ml-3">详情</button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-gray-500 font-medium">
                            没有找到符合条件的员工
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                  <span>共 {filteredStaffs.length} 条记录</span>
                  <div className="flex space-x-1">
                    <button className="px-2 py-1 border rounded bg-white text-gray-400 cursor-not-allowed">上一页</button>
                    <button className="px-2 py-1 border rounded bg-blue-50 text-blue-600 border-blue-200 font-medium">1</button>
                    <button className="px-2 py-1 border rounded bg-white hover:bg-gray-50">下一页</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2.2 审核中心 */}
          {activeTab === 'transfer_audit' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="flex space-x-6 border-b border-gray-200 mb-4">
                    <button
                      onClick={() => setAuditSubTab('pending')}
                      className={`pb-3 text-sm font-bold transition-colors relative ${
                        auditSubTab === 'pending' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      待办审核
                      {auditSubTab === 'pending' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
                      )}
                    </button>
                    <button
                      onClick={() => setAuditSubTab('logs')}
                      className={`pb-3 text-sm font-bold transition-colors relative ${
                        auditSubTab === 'logs' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      审核日志
                      {auditSubTab === 'logs' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {auditSubTab === 'pending' ? '由所属实体人事进行审核' : '查看已完成（通过/驳回）的审核记录'}
                  </p>
                </div>
                <div className="flex space-x-3">
                  {auditSubTab === 'pending' ? (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm flex items-center">
                        <CheckCircle size={16} className="mr-1.5" /> 批量通过
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center">
                        <XCircle size={16} className="mr-1.5" /> 批量驳回
                      </button>
                    </>
                  ) : (
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center shadow-sm">
                      <Upload size={16} className="mr-2" /> 导出记录
                    </button>
                  )}
                </div>
              </div>
              
              {renderAuditFilterBar(auditSubTab === 'logs')}

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold tracking-wider border-b border-gray-200">
                    <tr>
                      {auditSubTab === 'pending' && (
                        <th className="px-6 py-4 w-12">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={filteredAudits.length > 0 && selectedAuditIds.length === filteredAudits.length}
                            onChange={handleSelectAllAudits}
                          />
                        </th>
                      )}
                      <th className="px-6 py-4">操作对象</th>
                      <th className="px-6 py-4">操作类型</th>
                      <th className="px-6 py-4">申请时间</th>
                      <th className="px-6 py-4">申请人</th>
                      <th className="px-6 py-4">状态</th>
                      <th className="px-6 py-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {filteredAudits
                      .filter(audit => auditSubTab === 'pending' ? true : (audit.status === '已通过' || audit.status === '已驳回'))
                      .map((audit, i) => (
                      <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                        {auditSubTab === 'pending' && (
                          <td className="px-6 py-4">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedAuditIds.includes(audit.id)}
                              onChange={() => handleSelectAudit(audit.id)}
                            />
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">{audit.targetPerson}</div>
                          <div className="text-xs text-gray-500 font-mono">{audit.targetId}</div>
                        </td>
                        <td className="px-6 py-4 text-blue-600 font-medium">{audit.type}</td>
                        <td className="px-6 py-4 font-mono text-gray-500">{audit.applyTime}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">{audit.applicant}</div>
                          <div className="text-xs text-gray-500 font-mono">{audit.applicantId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            audit.status === '待审核' ? 'bg-yellow-100 text-yellow-700' : 
                            audit.status === '已通过' ? 'bg-green-100 text-green-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {audit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-2 py-1 rounded inline-flex items-center">
                            查看详情
                          </button>
                          {auditSubTab === 'pending' && audit.status === '待审核' && (
                            <>
                              <button className="text-green-600 hover:text-green-800 font-bold text-xs bg-green-50 px-2 py-1 rounded inline-flex items-center">
                                <CheckCircle size={12} className="mr-1" /> 通过
                              </button>
                              <button className="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 px-2 py-1 rounded inline-flex items-center">
                                <XCircle size={12} className="mr-1" /> 驳回
                              </button>
                            </>
                          )}
                          {auditSubTab === 'pending' && audit.status !== '待审核' && (
                            <button className="text-white hover:bg-red-700 font-bold text-xs bg-red-600 px-2 py-1 rounded inline-flex items-center shadow-sm">
                              <RotateCcw size={12} className="mr-1" /> 撤销
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. 员工花名册 */}
          {activeTab === 'roster' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-sm text-gray-500">人员变动记录（包含入职、离职、品牌调换的所有日志记录）</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center shadow-sm">
                    <Upload size={16} className="mr-2" /> 导出记录
                  </button>
                </div>
              </div>
              
              {renderStaffFilterBar()}

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">变动时间</th>
                      <th className="px-6 py-4">员工</th>
                      <th className="px-6 py-4">变动类型</th>
                      <th className="px-6 py-4 w-1/3">变动详情</th>
                      <th className="px-6 py-4">操作人</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {filteredRosterLogs.map((log, i) => (
                      <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-gray-600">{log.time}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">{log.employee}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                            log.type === '入职' ? 'bg-emerald-100 text-emerald-700' :
                            log.type === '离职' ? 'bg-gray-100 text-gray-600' :
                            log.type === '注册' ? 'bg-blue-50 text-blue-600' :
                            log.type === '通过审核' ? 'bg-green-100 text-green-700' :
                            log.type === '未通过审核' ? 'bg-red-100 text-red-700' :
                            log.type === '解编' ? 'bg-orange-100 text-orange-700' :
                            log.type === '绑编' ? 'bg-indigo-100 text-indigo-700' :
                            log.type === '拉黑' ? 'bg-slate-800 text-white' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 whitespace-normal">{log.details}</td>
                        <td className="px-6 py-4 text-gray-500">{log.operator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                  <span>共 {filteredRosterLogs.length} 条记录</span>
                  <div className="flex space-x-1">
                    <button className="px-2 py-1 border rounded bg-white text-gray-400 cursor-not-allowed">上一页</button>
                    <button className="px-2 py-1 border rounded bg-blue-50 text-blue-600 border-blue-200 font-medium">1</button>
                    <button className="px-2 py-1 border rounded bg-white hover:bg-gray-50">下一页</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quota Edit Modal */}
          {isEditingQuota && selectedNode && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-800">编辑定编额度</h3>
                  <button onClick={() => setIsEditingQuota(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">当前品牌节点</p>
                    <p className="font-bold text-gray-800">{selectedNode.name} <span className="text-gray-400 font-mono text-xs ml-2">({selectedNode.code})</span></p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">总编制数</label>
                      <input 
                        type="number" 
                        defaultValue={selectedNode.quotaTotal} 
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                      />
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-800 leading-relaxed">
                        <span className="font-bold">提示：</span>当前已使用 {selectedNode.quotaUsed || 0} 个名额。调低总编制数不会影响现有在职员工，但会限制新员工入职。
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                  <button 
                    onClick={() => setIsEditingQuota(false)} 
                    className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => setIsEditingQuota(false)} 
                    className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    保存配置
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* 6. 黑名单列表 */}
          {activeTab === 'blacklist' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-sm text-gray-500">展示所有被拉黑的员工，拉黑后无法再次入职</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center shadow-sm">
                    <Upload size={16} className="mr-2" /> 导出列表
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center shadow-sm">
                    <Plus size={16} className="mr-2" /> 新增黑名单
                  </button>
                </div>
              </div>

              {renderStaffFilterBar()}

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[750px]">
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center">
                    <UserX className="mr-2 text-red-500" size={20} />
                    黑名单人员记录
                  </h3>
                </div>
              <div className="flex-1 overflow-auto custom-scrollbar p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200 sticky top-0 z-10">
                      <th className="p-4 font-bold">姓名</th>
                      <th className="p-4 font-bold">工号</th>
                      <th className="p-4 font-bold">手机</th>
                      <th className="p-4 font-bold">入职时间</th>
                      <th className="p-4 font-bold">离职时间</th>
                      <th className="p-4 font-bold">拉黑时间</th>
                      <th className="p-4 font-bold">拉黑原因</th>
                      <th className="p-4 font-bold text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {filteredBlacklist.map((staff, idx) => (
                      <tr key={idx} className="hover:bg-red-50/50 transition-colors">
                        <td className="p-4 font-medium text-gray-800">{staff.name}</td>
                        <td className="p-4 text-gray-500 font-mono text-xs">{staff.id}</td>
                        <td className="p-4 text-gray-600">{staff.phone}</td>
                        <td className="p-4 text-gray-600">{staff.entryTime}</td>
                        <td className="p-4 text-gray-600">{staff.resignTime}</td>
                        <td className="p-4 text-red-600 font-medium">{staff.blacklistTime || '-'}</td>
                        <td className="p-4 text-gray-600 max-w-xs truncate" title={staff.blacklistReason}>{staff.blacklistReason}</td>
                        <td className="p-4 text-right space-x-3">
                          <button 
                            onClick={() => setSelectedStaff(staff)}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            详情
                          </button>
                          <button 
                            onClick={() => {
                              setUnblacklistStaff(staff);
                              setUnblacklistReason('');
                            }}
                            className="text-red-600 hover:text-red-800 font-medium transition-colors"
                          >
                            解除拉黑
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredBlacklist.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-400">
                          暂无黑名单记录
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          )}
        </main>
      </div>

      {/* Fullscreen Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shrink-0 shadow-sm">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSelectedStaff(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">员工详情 - {selectedStaff.name}</h2>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
              编辑信息
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-8">
              
              {/* Basic Info */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3 flex items-center">
                  <Users size={18} className="mr-2 text-blue-600" />
                  基本信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">姓名</p>
                    <p className="font-medium text-gray-800 text-base">{selectedStaff.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">手机号</p>
                    <p className="font-mono font-medium text-gray-800 text-base">{selectedStaff.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">工号</p>
                    <p className="font-mono font-medium text-gray-800 text-base">{selectedStaff.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">类型</p>
                    <p className="font-medium text-gray-800 text-base">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        selectedStaff.type === '厂聘' ? 'bg-purple-100 text-purple-700' : 
                        selectedStaff.type === '正式' ? 'bg-blue-100 text-blue-700' : 
                        'bg-orange-100 text-orange-700'
                      }`}>{selectedStaff.type}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">角色</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedStaff.tags && selectedStaff.tags.length > 0 ? (
                        selectedStaff.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium border border-gray-200">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">所属实体</p>
                    <p className="font-medium text-gray-800 text-base">{selectedStaff.entity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">所属品牌</p>
                    <p className="font-medium text-gray-800 text-base">{selectedStaff.brand}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">状态</p>
                    <p className="font-medium text-gray-800 text-base">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        selectedStaff.status === '未注册' ? 'bg-slate-100 text-slate-500' :
                        selectedStaff.status === '未审核' ? 'bg-orange-100 text-orange-600' :
                        selectedStaff.status === '已审核' ? 'bg-blue-100 text-blue-600' :
                        selectedStaff.status === '已入职' ? 'bg-green-100 text-green-600' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {selectedStaff.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">入职时间</p>
                    <p className="font-mono font-medium text-gray-800 text-base">{selectedStaff.entryTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">健康证</p>
                    <p className="font-medium text-gray-800 text-base">{selectedStaff.healthCert}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">分类/标签</p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedStaff.tags.map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resignation & Risk Info */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3 flex items-center">
                  <ClipboardCheck size={18} className="mr-2 text-orange-600" />
                  离职与风控信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">离职时间</p>
                    <p className="font-mono font-medium text-gray-800 text-base">{selectedStaff.resignTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">离职证明</p>
                    <p className="font-medium text-gray-800 text-base">{selectedStaff.resignCert}</p>
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">离职原因</p>
                    <p className="font-medium text-gray-800 text-base bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedStaff.resignReason}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">是否拉黑</p>
                    <p className={`font-bold text-base ${selectedStaff.isBlacklisted ? 'text-red-600' : 'text-gray-800'}`}>
                      {selectedStaff.isBlacklisted ? '是' : '否'}
                    </p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-bold">拉黑原因</p>
                    <p className={`font-medium text-base ${selectedStaff.isBlacklisted ? 'text-red-600' : 'text-gray-400'}`}>
                      {selectedStaff.blacklistReason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3 flex items-center">
                  <Paperclip size={18} className="mr-2 text-blue-600" />
                  附件信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { id: 'id_card', name: '身份证复印件', keywords: ['身份证'] },
                    { id: 'health_cert', name: '健康证', keywords: ['健康证'] },
                    { id: 'registration', name: '入职登记表', keywords: ['入职登记表', '登记表'] },
                    { id: 'contract', name: '劳动合同', keywords: ['合同'] },
                    { id: 'resignation', name: '离职证明', keywords: ['离职证明'] },
                    { id: 'bank_card', name: '银行卡复印件', keywords: ['银行卡'] },
                  ].map(cat => {
                    const files = (selectedStaff.attachments || []).filter((att: string) => cat.keywords.some(kw => att.includes(kw)));
                    return (
                      <div key={cat.id} className="flex flex-col p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <span className="text-sm font-bold text-gray-700 mb-3">{cat.name}</span>
                        {files.length > 0 ? (
                          <div className="space-y-2">
                            {files.map((file: string, idx: number) => (
                              <div key={idx} className="flex items-center px-3 py-2 bg-white border border-blue-100 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors group">
                                <Paperclip size={14} className="text-blue-400 group-hover:text-blue-600 mr-2 shrink-0" />
                                <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700 truncate">{file}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded">未补充</span>
                            <button className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center">
                              <Upload size={12} className="mr-1" /> 上传
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Other Attachments */}
                  {(() => {
                    const predefinedKeywords = ['身份证', '健康证', '入职登记表', '登记表', '合同', '离职证明', '银行卡'];
                    const otherFiles = (selectedStaff.attachments || []).filter((att: string) => 
                      !predefinedKeywords.some(kw => att.includes(kw))
                    );
                    
                    if (otherFiles.length === 0) return null;
                    
                    return (
                      <div className="flex flex-col p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <span className="text-sm font-bold text-gray-700 mb-3">其他附件</span>
                        <div className="space-y-2">
                          {otherFiles.map((file: string, idx: number) => (
                            <div key={idx} className="flex items-center px-3 py-2 bg-white border border-blue-100 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors group">
                              <Paperclip size={14} className="text-blue-400 group-hover:text-blue-600 mr-2 shrink-0" />
                              <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700 truncate">{file}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Employment History */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3 flex items-center">
                  <History size={18} className="mr-2 text-indigo-600" />
                  任职履历
                </h3>
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-4 mt-4">
                  {rosterLogs
                    .filter(log => log.employee.includes(selectedStaff.id))
                    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                    .map((log, idx) => (
                      <div key={idx} className="relative pl-6">
                        <div className="absolute w-4 h-4 bg-white border-2 border-indigo-500 rounded-full -left-[9px] top-1"></div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                          <h4 className="text-md font-bold text-gray-900">{log.type}</h4>
                          <span className="text-sm font-mono text-gray-500">{log.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                        <p className="text-xs text-gray-400 mt-2 font-medium">操作人: {log.operator}</p>
                      </div>
                    ))}
                  {rosterLogs.filter(log => log.employee.includes(selectedStaff.id)).length === 0 && (
                    <p className="text-sm text-gray-400 pl-6">暂无履历记录</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Unblacklist Confirmation Modal */}
      {unblacklistStaff && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[480px] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center">
                <UserX className="mr-2 text-red-500" size={18} />
                解除拉黑确认
              </h3>
              <button 
                onClick={() => setUnblacklistStaff(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                您确定要解除员工 <span className="font-bold text-gray-900">{unblacklistStaff.name} ({unblacklistStaff.id})</span> 的黑名单状态吗？
              </p>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  解除拉黑理由 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={unblacklistReason}
                  onChange={(e) => setUnblacklistReason(e.target.value)}
                  placeholder="请输入解除拉黑的详细理由..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none h-24"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setUnblacklistStaff(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                disabled={!unblacklistReason.trim()}
                onClick={() => {
                  // In a real app, this would call an API
                  console.log('Unblacklisting staff:', unblacklistStaff.id, 'Reason:', unblacklistReason);
                  setUnblacklistStaff(null);
                }}
                className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors ${
                  unblacklistReason.trim() 
                    ? 'bg-red-600 hover:bg-red-700 shadow-sm' 
                    : 'bg-red-300 cursor-not-allowed'
                }`}
              >
                确认解除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Root-level Action Menu to avoid clipping */}
      {openActionMenuId && activeActionStaff && (
        <div 
          className="fixed w-32 bg-white rounded-lg border border-gray-300 py-1 z-[9999] flex flex-col"
          style={{ top: `${menuPosition.top}px`, right: `${menuPosition.right}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            disabled={!['已审核', '已离职'].includes(activeActionStaff.status)}
            className={`block w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
              ['已审核', '已离职'].includes(activeActionStaff.status) 
                ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-700' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            入职
          </button>
          <button 
            disabled={activeActionStaff.status !== '已入职'}
            className={`block w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
              activeActionStaff.status === '已入职'
                ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-700' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            绑编/解编
          </button>
          <button 
            disabled={!['未注册', '未审核', '已审核', '已入职'].includes(activeActionStaff.status)}
            className={`block w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
              ['未注册', '未审核', '已审核', '已入职'].includes(activeActionStaff.status)
                ? 'text-red-600 hover:bg-red-50' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            离职
          </button>
        </div>
      )}
    </div>
  );
}
