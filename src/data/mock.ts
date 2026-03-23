export const orgTree = [
  {
    id: 'root',
    name: '集团总部',
    level: '集团',
    children: [
      {
        id: 'entity_1',
        name: '上海A商场',
        level: '实体',
        children: [
          {
            id: 'floor_1',
            name: '1F 美妆珠宝',
            level: '楼层',
            children: [
              {
                id: 'area_1',
                name: '珠宝区',
                level: '区域',
                children: [
                  { id: 'brand_1', name: '周大福', level: '品牌', quotaTotal: 10, quotaUsed: 8, code: 'B001', entity: '上海A商场' },
                  { id: 'brand_2', name: '周生生', level: '品牌', quotaTotal: 5, quotaUsed: 1, code: 'B002', entity: '上海A商场' }
                ]
              },
              {
                id: 'area_2',
                name: '美妆区',
                level: '区域',
                children: [
                  { id: 'brand_3', name: '雅诗兰黛', level: '品牌', quotaTotal: 8, quotaUsed: 8, code: 'B003', entity: '上海A商场' },
                  { id: 'brand_4', name: '兰蔻', level: '品牌', quotaTotal: 6, quotaUsed: 4, code: 'B004', entity: '上海A商场' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'unassigned',
    name: '未分配',
    level: '集团',
    children: []
  }
];

export const allStaffs = [
  {
    id: 'EMP001',
    name: '张三',
    phone: '13800138001',
    type: '正式',
    tags: ['普通人员'],
    entity: '集团总部',
    brand: '周大福',
    healthCert: '-',
    status: '未注册',
    entryTime: '-',
    resignCert: '-',
    resignTime: '-',
    resignReason: '-',
    isBlacklisted: false,
    blacklistReason: '-',
    attachments: []
  },
  {
    id: 'EMP002',
    name: '李四',
    phone: '13900139002',
    type: '厂聘',
    tags: ['普通人员'],
    entity: '黄石武商MALL',
    brand: '周生生',
    healthCert: '有效 (2026-10-15)',
    status: '未审核',
    entryTime: '-',
    resignCert: '-',
    resignTime: '-',
    resignReason: '-',
    isBlacklisted: false,
    blacklistReason: '-',
    attachments: ['身份证.pdf']
  },
  {
    id: 'EMP003',
    name: '王五',
    phone: '13700137003',
    type: '临时',
    tags: ['普通人员'],
    entity: '武商MALL',
    brand: '雅诗兰黛',
    healthCert: '有效 (2026-12-31)',
    status: '已审核',
    entryTime: '-',
    resignCert: '-',
    resignTime: '-',
    resignReason: '-',
    isBlacklisted: false,
    blacklistReason: '-',
    attachments: ['身份证.pdf', '健康证.jpg']
  },
  {
    id: 'EMP004',
    name: '赵六',
    phone: '13600136004',
    type: '正式',
    tags: ['店长'],
    entity: '武商MALL',
    brand: '兰蔻',
    healthCert: '有效 (2026-08-20)',
    status: '已入职',
    entryTime: '2024-01-10',
    resignCert: '-',
    resignTime: '-',
    resignReason: '-',
    isBlacklisted: false,
    blacklistReason: '-',
    attachments: ['身份证.pdf', '健康证.jpg', '入职登记表.pdf']
  },
  {
    id: 'EMP005',
    name: '孙七',
    phone: '13500135005',
    type: '厂聘',
    tags: ['普通人员'],
    entity: '集团总部',
    brand: '周大福',
    healthCert: '已过期',
    status: '已离职',
    entryTime: '2022-05-15',
    resignCert: '已开具',
    resignTime: '2024-03-01',
    resignReason: '个人原因',
    isBlacklisted: false,
    blacklistTime: '-',
    blacklistReason: '-',
    attachments: ['离职证明.pdf']
  },
  {
    id: 'EMP006',
    name: '周八',
    phone: '13400134006',
    type: '临时',
    tags: ['普通人员'],
    entity: '武商MALL',
    brand: '兰蔻',
    healthCert: '-',
    status: '已离职',
    entryTime: '2023-01-10',
    resignCert: '-',
    resignTime: '2023-06-15',
    resignReason: '严重违纪',
    isBlacklisted: true,
    blacklistTime: '2023-06-16',
    blacklistReason: '多次无故旷工且态度恶劣',
    attachments: []
  }
];

export const auditTasks = [
  {
    id: 'AUD001',
    targetPerson: '张三',
    targetId: 'EMP001',
    type: '注册',
    applyTime: '2024-03-20 09:00',
    applicant: '张三',
    applicantId: 'EMP001',
    status: '待审核'
  },
  {
    id: 'AUD002',
    targetPerson: '李四',
    targetId: 'EMP002',
    type: '入职',
    applyTime: '2024-03-19 14:30',
    applicant: '李四',
    applicantId: 'EMP002',
    status: '待审核'
  },
  {
    id: 'AUD003',
    targetPerson: '王五',
    targetId: 'EMP003',
    type: '解编',
    applyTime: '2024-03-18 10:15',
    applicant: '王五',
    applicantId: 'EMP003',
    status: '已通过'
  },
  {
    id: 'AUD004',
    targetPerson: '赵六',
    targetId: 'EMP004',
    type: '拉黑',
    applyTime: '2024-03-15 16:40',
    applicant: '人事-张主管',
    applicantId: 'HR001',
    status: '已驳回'
  },
  {
    id: 'AUD005',
    targetPerson: '钱七',
    targetId: 'EMP007',
    type: '绑编',
    applyTime: '2024-03-20 11:20',
    applicant: '钱七',
    applicantId: 'EMP007',
    status: '待审核'
  },
  {
    id: 'AUD006',
    targetPerson: '孙八',
    targetId: 'EMP008',
    type: '离职',
    applyTime: '2024-03-19 09:10',
    applicant: '孙八',
    applicantId: 'EMP008',
    status: '待审核'
  }
];

export const rosterLogs = [
  {
    id: 'LOG001',
    time: '2024-03-18 10:30',
    employee: '李四 (EMP002)',
    type: '解编',
    details: '从 [周大福] 调出，已成功解除编制',
    operator: '李四'
  },
  {
    id: 'LOG002',
    time: '2024-02-01 17:00',
    employee: '王五 (EMP003)',
    type: '离职',
    details: '办理离职手续，原因：个人原因',
    operator: '人事-张主管'
  },
  {
    id: 'LOG003',
    time: '2024-01-20 09:00',
    employee: '李四 (EMP002)',
    type: '入职',
    details: '新员工入职，分配至 [周大福]',
    operator: '普通人员-张三'
  },
  {
    id: 'LOG004',
    time: '2023-11-15 14:00',
    employee: '赵六 (EMP004)',
    type: '拉黑',
    details: '因严重违纪解除劳动合同并加入黑名单',
    operator: '集团风控部'
  },
  {
    id: 'LOG005',
    time: '2024-03-19 11:00',
    employee: '张三 (EMP001)',
    type: '注册',
    details: '员工在系统完成初始注册',
    operator: '张三'
  },
  {
    id: 'LOG006',
    time: '2024-03-19 14:30',
    employee: '张三 (EMP001)',
    type: '通过审核',
    details: '员工入职资料审核通过',
    operator: '人事-张主管'
  },
  {
    id: 'LOG007',
    time: '2024-03-19 15:00',
    employee: '钱七 (EMP007)',
    type: '未通过审核',
    details: '健康证过期，审核驳回',
    operator: '人事-张主管'
  },
  {
    id: 'LOG008',
    time: '2024-03-20 09:30',
    employee: '李四 (EMP002)',
    type: '绑编',
    details: '调入 [周生生] 成功，已绑定编制',
    operator: '王店长'
  }
];

export const flatTransferLogs = [
  { id: 'TR001', time: '2024-03-18 10:30', applicant: '李四 (EMP002)', type: '解编', path: '上海A商场(周大福) -> 上海A商场(周生生)', result: '待审核' },
  { id: 'TR002', time: '2024-03-17 14:20', applicant: '孙七 (EMP005)', type: '绑编', path: '上海A商场(兰蔻) -> 上海B商场(兰蔻)', result: '通过' },
  { id: 'TR003', time: '2024-03-16 09:15', applicant: '王五 (EMP003)', type: '解编', path: '上海B商场(雅诗兰黛) -> 上海A商场(雅诗兰黛)', result: '驳回' },
  { id: 'TR004', time: '2024-03-15 16:40', applicant: '赵六 (EMP004)', type: '绑编', path: '上海C商场(周大福) -> 上海A商场(周生生)', result: '失败' }
];

export const transferAuditDetails = [
  {
    id: 'TR001',
    applicant: '李四 (EMP002)',
    type: '解编',
    fromEntity: '上海A商场',
    fromBrand: '周大福',
    toEntity: '上海A商场',
    toBrand: '周生生',
    reason: '品牌内部调动，支援周生生专柜促销活动',
    applyTime: '2024-03-18 10:30',
    status: '待审核',
    timeline: [
      { time: '2024-03-18 10:30', node: '发起申请', operator: '李四 (EMP002)', action: '提交申请', comment: '-' },
      { time: '2024-03-18 11:15', node: '调出品牌审核', operator: '张三 (普通人员)', action: '同意', comment: '同意调出' },
      { time: '-', node: '调入品牌审核', operator: '王店长', action: '待处理', comment: '-' },
      { time: '-', node: '实体人事审核', operator: '人事部', action: '待处理', comment: '-' }
    ]
  },
  {
    id: 'TR002',
    applicant: '孙七 (EMP005)',
    type: '绑编',
    fromEntity: '上海A商场',
    fromBrand: '兰蔻',
    toEntity: '上海B商场',
    toBrand: '兰蔻',
    reason: '员工个人发展需要，申请调往B商场',
    applyTime: '2024-03-17 14:20',
    status: '已通过',
    timeline: [
      { time: '2024-03-17 14:20', node: '发起申请', operator: '孙七 (EMP005)', action: '提交申请', comment: '-' },
      { time: '2024-03-17 15:00', node: '调出品牌审核', operator: '赵店长', action: '同意', comment: '同意调出' },
      { time: '2024-03-17 16:30', node: '调入品牌审核', operator: '钱店长', action: '同意', comment: '欢迎加入' },
      { time: '2024-03-18 09:15', node: '实体人事审核', operator: '李人事', action: '同意', comment: '手续合规，同意调动' }
    ]
  }
];
