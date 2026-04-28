// 月度填报系统 - 纯静态版本
// 数据存储
const Store = {
  // 获取数据
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  // 设置数据
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // 获取计划列表
  getPlans() {
    let plans = this.get('plans');
    if (!plans) {
      plans = [
        {
          id: '1',
          month: '2026-04',
          name: '4月安全生产专项检查',
          fields: [
            { name: '出动人次' },
            { name: '出动车次' },
            { name: '查处数量' },
            { name: '检查情况说明' }
          ],
          status: 'normal',
          createTime: '2026-03-28 09:30:00'
        },
        {
          id: '2',
          month: '2026-04',
          name: '4月环保巡查计划',
          fields: [
            { name: '巡查企业数' },
            { name: '发现问题数' },
            { name: '整改数量' },
            { name: '巡查详情' }
          ],
          status: 'normal',
          createTime: '2026-03-29 14:20:00'
        },
        {
          id: '3',
          month: '2026-03',
          name: '3月联合执法行动',
          fields: [
            { name: '出动人次' },
            { name: '出动车次' },
            { name: '查处数量' }
          ],
          status: 'normal',
          createTime: '2026-02-25 10:00:00'
        },
        {
          id: '4',
          month: '2026-03',
          name: '3月日常巡查',
          fields: [
            { name: '巡查次数' },
            { name: '发现问题' }
          ],
          status: 'cancelled',
          createTime: '2026-02-20 08:00:00'
        },
        {
          id: '5',
          month: '2026-05',
          name: '5月食品安全专项检查',
          fields: [
            { name: '检查单位数' },
            { name: '抽检批次' },
            { name: '不合格批次' },
            { name: '整改通知书数' },
            { name: '检查情况' }
          ],
          status: 'normal',
          createTime: '2026-04-20 10:00:00'
        }
      ];
      this.set('plans', plans);
    }
    return plans;
  },

  // 获取用户填报数据
  getUserReports() {
    let reports = this.get('userReports');
    if (!reports) {
      reports = [
        {
          id: '1',
          planId: '1',
          planName: '4月安全生产专项检查',
          userId: 'user1',
          userName: '张明',
          department: '市场监督管理局',
          content: {
            '出动人次': '15',
            '出动车次': '5',
            '查处数量': '23',
            '检查情况说明': '本月对辖区内的重点企业进行了安全生产专项检查，发现问题已全部整改。'
          },
          submitTime: '2026-04-15 14:30:00',
          lastModified: '2026-04-15 14:30:00'
        },
        {
          id: '2',
          planId: '1',
          planName: '4月安全生产专项检查',
          userId: 'user2',
          userName: '李娜',
          department: '执法二队',
          content: {
            '出动人次': '12',
            '出动车次': '4',
            '查处数量': '18',
            '检查情况说明': '检查了8家企业，发现安全隐患3处，已下达整改通知书。'
          },
          submitTime: '2026-04-16 09:20:00',
          lastModified: '2026-04-16 09:20:00'
        },
        {
          id: '3',
          planId: '2',
          planName: '4月环保巡查计划',
          userId: 'user1',
          userName: '张明',
          department: '市场监督管理局',
          content: {
            '巡查企业数': '25',
            '发现问题数': '6',
            '整改数量': '5',
            '巡查详情': '重点巡查了化工企业和污水处理厂，大部分企业环保设施运行正常。'
          },
          submitTime: '2026-04-18 10:45:00',
          lastModified: '2026-04-18 10:45:00'
        }
      ];
      this.set('userReports', reports);
    }
    return reports;
  },

  // 添加计划
  addPlan(plan) {
    const plans = this.getPlans();
    const newPlan = {
      ...plan,
      id: Date.now().toString(),
      status: 'normal',
      createTime: formatDateTime(new Date())
    };
    plans.push(newPlan);
    this.set('plans', plans);
    return newPlan;
  },

  // 更新计划
  updatePlan(id, data) {
    const plans = this.getPlans();
    const index = plans.findIndex(p => p.id === id);
    if (index !== -1) {
      plans[index] = { ...plans[index], ...data };
      this.set('plans', plans);
      return plans[index];
    }
    return null;
  },

  // 作废计划
  cancelPlan(id) {
    const plans = this.getPlans();
    const plan = plans.find(p => p.id === id);
    if (plan) {
      plan.status = plan.status === 'cancelled' ? 'normal' : 'cancelled';
      this.set('plans', plans);
      return plan;
    }
    return null;
  },

  // 删除计划
  deletePlan(id) {
    let plans = this.getPlans();
    plans = plans.filter(p => p.id !== id);
    this.set('plans', plans);
    // 同时删除关联的填报数据
    let reports = this.getUserReports();
    reports = reports.filter(r => r.planId !== id);
    this.set('userReports', reports);
  },

  // 添加用户填报
  addUserReport(report) {
    const reports = this.getUserReports();
    const newReport = {
      ...report,
      id: Date.now().toString()
    };
    reports.push(newReport);
    this.set('userReports', reports);
    return newReport;
  },

  // 更新用户填报
  updateUserReport(planId, userId, content) {
    const reports = this.getUserReports();
    const index = reports.findIndex(r => r.planId === planId && r.userId === userId);
    if (index !== -1) {
      reports[index].content = content;
      reports[index].lastModified = formatDateTime(new Date());
      this.set('userReports', reports);
      return reports[index];
    }
    return null;
  },

  // 获取计划的用户填报数据
  getPlanReports(planId) {
    return this.getUserReports().filter(r => r.planId === planId);
  },

  // 检查用户是否已填报
  hasUserReport(planId, userId) {
    return this.getUserReports().some(r => r.planId === planId && r.userId === userId);
  },

  // 获取用户的填报数据
  getUserReport(planId, userId) {
    return this.getUserReports().find(r => r.planId === planId && r.userId === userId);
  }
};

// 当前用户ID（模拟）
const currentUserId = 'user1';

// 工具函数
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function formatMonth(monthStr) {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  return `${year}年${parseInt(month)}月`;
}

function getStatusType(status) {
  const types = { normal: 'success', cancelled: 'warning' };
  return types[status] || 'info';
}

function getStatusText(status) {
  const texts = { normal: '正常', cancelled: '已作废' };
  return texts[status] || status;
}

// Toast提示
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// 路由
function router() {
  const hash = window.location.hash || '#/report';
  const path = hash.replace('#', '');

  // 隐藏所有页面
  document.querySelectorAll('.page-container').forEach(p => p.style.display = 'none');

  // 更新导航状态
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  if (path === '/plan') {
    document.getElementById('page-plan').style.display = 'block';
    document.getElementById('nav-plan').classList.add('active');
    renderPlanPage();
  } else {
    document.getElementById('page-report').style.display = 'block';
    document.getElementById('nav-report').classList.add('active');
    renderReportPage();
  }
}

// ========== 用户填报页面 ==========
let reportPage = 1;
const reportPageSize = 10;

function renderReportPage() {
  const plans = Store.getPlans().filter(p => p.status === 'normal');
  renderReportTable(plans);
}

function renderReportTable(plans) {
  const tbody = document.getElementById('report-table-body');
  const start = (reportPage - 1) * reportPageSize;
  const end = start + reportPageSize;
  const pageData = plans.slice(start, end);

  tbody.innerHTML = pageData.map(plan => {
    const fieldsHtml = plan.fields.slice(0, 3).map(f =>
      `<span class="tag tag-info tag-small">${f.name}</span>`
    ).join('') + (plan.fields.length > 3 ? `<span class="tag tag-info tag-small">+${plan.fields.length - 3}</span>` : '');

    const hasData = Store.hasUserReport(plan.id, currentUserId);

    let statusHtml;
    if (hasData) {
      statusHtml = `<span class="tag tag-success">已填报</span>`;
    } else {
      statusHtml = `<span class="tag tag-warning">待填报</span>`;
    }

    return `
      <tr>
        <td>${plan.name}</td>
        <td>${formatMonth(plan.month)}</td>
        <td>${fieldsHtml}</td>
        <td>${statusHtml}</td>
        <td><button class="btn btn-link" onclick="openReportModal('${plan.id}')">填报</button></td>
      </tr>
    `;
  }).join('');

  renderPagination('report-pagination', plans.length, reportPage, reportPageSize, (page) => {
    reportPage = page;
    renderReportTable(plans);
  });
}

// ========== 计划设置页面 ==========
let planPage = 1;
let detailPage = 1;
let detailPageSize = 10;
const planPageSize = 10;
let selectedPlanId = null;
let editingPlanId = null;
let planToDeleteId = null;
let planToCancelId = null;

function renderPlanPage() {
  if (selectedPlanId) {
    renderPlanDetail();
  } else {
    renderPlanList();
  }
}

function renderPlanList() {
  const plans = Store.getPlans();
  const tbody = document.getElementById('plan-table-body');
  const start = (planPage - 1) * planPageSize;
  const end = start + planPageSize;
  const pageData = plans.slice(start, end);

  document.getElementById('plan-list-view').style.display = 'block';
  document.getElementById('plan-detail-view').style.display = 'none';

  tbody.innerHTML = pageData.map(plan => {
    const fieldsHtml = plan.fields.slice(0, 3).map(f =>
      `<span class="tag tag-info tag-small">${f.name}</span>`
    ).join('') + (plan.fields.length > 3 ? `<span class="tag tag-info tag-small">+${plan.fields.length - 3}</span>` : '');

    return `
      <tr>
        <td>
          <span class="plan-name-link" onclick="viewPlanDetail('${plan.id}')">
            ${plan.name}
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </span>
        </td>
        <td>${formatMonth(plan.month)}</td>
        <td>${fieldsHtml}</td>
        <td><span class="tag tag-${getStatusType(plan.status)}">${getStatusText(plan.status)}</span></td>
        <td>
          <button class="btn btn-link" onclick="openEditPlanModal('${plan.id}')">编辑</button>
          ${plan.status !== 'cancelled' ? `<button class="btn btn-link" style="color:var(--warning)" onclick="openCancelModal('${plan.id}')">作废</button>` : ''}
          <button class="btn btn-link" style="color:var(--danger)" onclick="openDeleteModal('${plan.id}')">删除</button>
        </td>
      </tr>
    `;
  }).join('');

  renderPagination('plan-pagination', plans.length, planPage, planPageSize, (page) => {
    planPage = page;
    renderPlanList();
  });
}

function renderPlanDetail() {
  const plan = Store.getPlans().find(p => p.id === selectedPlanId);
  if (!plan) {
    showToast('计划不存在');
    selectedPlanId = null;
    renderPlanList();
    return;
  }

  const reports = Store.getPlanReports(plan.id);

  document.getElementById('plan-list-view').style.display = 'none';
  document.getElementById('plan-detail-view').style.display = 'block';

  document.getElementById('detail-plan-name').textContent = plan.name;
  document.getElementById('detail-plan-info').textContent = `${formatMonth(plan.month)} | ${plan.fields.length} 个填报字段`;

  // 表头
  const headerHtml = `
    <th>用户姓名</th>
    <th>所属部门</th>
    ${plan.fields.map(f => `<th>${f.name}</th>`).join('')}
    <th>最后修改</th>
  `;
  document.getElementById('detail-table-header').innerHTML = headerHtml;

  // 数据
  const tbody = document.getElementById('detail-table-body');
  const start = (detailPage - 1) * detailPageSize;
  const end = start + detailPageSize;
  const pageData = reports.slice(start, end);

  if (reports.length === 0) {
    tbody.innerHTML = '';
    document.getElementById('detail-empty').style.display = 'block';
  } else {
    document.getElementById('detail-empty').style.display = 'none';
    tbody.innerHTML = pageData.map(report => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-avatar">${report.userName.charAt(0)}</div>
            <span>${report.userName}</span>
          </div>
        </td>
        <td><span class="tag tag-info tag-small">${report.department}</span></td>
        ${plan.fields.map(f => `<td>${report.content[f.name] || '-'}</td>`).join('')}
        <td>${formatDateTimeDisplay(report.lastModified || report.submitTime)}</td>
      </tr>
    `).join('');
  }

  renderPagination('detail-pagination', reports.length, detailPage, detailPageSize, (page) => {
    detailPage = page;
    renderPlanDetail();
  });
}

function formatDateTimeDisplay(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function viewPlanDetail(planId) {
  selectedPlanId = planId;
  detailPage = 1;
  renderPlanDetail();
}

function backToList() {
  selectedPlanId = null;
  renderPlanList();
}

// ========== 填报弹窗 ==========
function openReportModal(planId) {
  const plan = Store.getPlans().find(p => p.id === planId);
  if (!plan) return;

  const modal = document.getElementById('report-modal');
  const existingReport = Store.getUserReport(planId, currentUserId);

  document.getElementById('report-modal-title').textContent = `填报 - ${plan.name}`;
  document.getElementById('report-modal-month').textContent = `月份：${formatMonth(plan.month)}`;

  const statusEl = document.getElementById('report-modal-status');
  if (existingReport) {
    statusEl.style.display = 'inline';
    statusEl.className = 'status-text has-data';
  } else {
    statusEl.style.display = 'none';
  }

  // 构建Excel表格
  const thead = document.querySelector('#report-excel-table thead');
  const tbody = document.querySelector('#report-excel-table tbody');

  thead.innerHTML = `<tr>${plan.fields.map(f => `<th>${f.name}</th>`).join('')}</tr>`;

  const formData = existingReport ? existingReport.content : {};
  plan.fields.forEach(f => {
    if (!formData[f.name]) formData[f.name] = '';
  });

  tbody.innerHTML = `<tr>${plan.fields.map(f => `
    <td class="input-cell">
      <input type="text" class="content-input" data-field="${f.name}" value="${formData[f.name] || ''}" placeholder="请填写${f.name}">
    </td>
  `).join('')}</tr>`;

  modal.dataset.planId = planId;
  modal.classList.add('show');
}

function closeReportModal() {
  document.getElementById('report-modal').classList.remove('show');
}

function submitReport() {
  const modal = document.getElementById('report-modal');
  const planId = modal.dataset.planId;
  const plan = Store.getPlans().find(p => p.id === planId);
  if (!plan) return;

  const content = {};
  let hasContent = false;

  plan.fields.forEach(f => {
    const input = document.querySelector(`input[data-field="${f.name}"]`);
    content[f.name] = input ? input.value : '';
    if (content[f.name] && content[f.name].trim()) {
      hasContent = true;
    }
  });

  if (!hasContent) {
    showToast('请完善填报信息', 'warning');
    return;
  }

  const existingReport = Store.getUserReport(planId, currentUserId);
  if (existingReport) {
    Store.updateUserReport(planId, currentUserId, content);
    showToast('修改已保存，留痕成功', 'success');
  } else {
    Store.addUserReport({
      planId: planId,
      planName: plan.name,
      userId: currentUserId,
      userName: '张明',
      department: '市场监督管理局',
      content: content,
      submitTime: formatDateTime(new Date()),
      lastModified: formatDateTime(new Date())
    });
    showToast('提交成功，留痕成功', 'success');
  }

  closeReportModal();
  renderReportPage();
}

// ========== 计划弹窗 ==========
function openAddPlanModal() {
  editingPlanId = null;
  document.getElementById('plan-modal-title').textContent = '新增计划';
  document.getElementById('plan-form-name').value = '';
  document.getElementById('plan-form-month').value = '';
  renderFieldsConfig([{ name: '' }]);
  document.getElementById('plan-modal').classList.add('show');
}

function openEditPlanModal(planId) {
  const plan = Store.getPlans().find(p => p.id === planId);
  if (!plan) return;

  editingPlanId = planId;
  document.getElementById('plan-modal-title').textContent = '编辑计划';
  document.getElementById('plan-form-name').value = plan.name;
  document.getElementById('plan-form-month').value = plan.month;
  renderFieldsConfig(plan.fields.map(f => ({ name: f.name })));
  document.getElementById('plan-modal').classList.add('show');
}

function closePlanModal() {
  document.getElementById('plan-modal').classList.remove('show');
  editingPlanId = null;
}

function renderFieldsConfig(fields) {
  const container = document.getElementById('fields-config');
  container.innerHTML = fields.map((f, i) => `
    <div class="field-item">
      <input type="text" value="${f.name}" placeholder="字段名称" data-field-index="${i}">
      <button class="btn" style="padding:6px 10px;color:var(--danger)" onclick="removeField(${i})" ${fields.length <= 1 ? 'disabled' : ''}>×</button>
    </div>
  `).join('');
}

function addField() {
  const inputs = document.querySelectorAll('#fields-config input');
  const fields = Array.from(inputs).map((input, i) => ({ name: input.value }));
  fields.push({ name: '' });
  renderFieldsConfig(fields);
}

function removeField(index) {
  const inputs = document.querySelectorAll('#fields-config input');
  if (inputs.length <= 1) return;
  const fields = Array.from(inputs).map((input, i) => ({ name: input.value }));
  fields.splice(index, 1);
  renderFieldsConfig(fields);
}

function submitPlan() {
  const name = document.getElementById('plan-form-name').value.trim();
  const month = document.getElementById('plan-form-month').value;
  const fields = [];

  document.querySelectorAll('#fields-config input').forEach(input => {
    if (input.value.trim()) {
      fields.push({ name: input.value.trim() });
    }
  });

  if (!name) {
    showToast('请输入计划名称', 'warning');
    return;
  }
  if (!month) {
    showToast('请选择月份', 'warning');
    return;
  }
  if (fields.length === 0) {
    showToast('请至少添加一个填报字段', 'warning');
    return;
  }

  const planData = { name, month, fields };

  if (editingPlanId) {
    Store.updatePlan(editingPlanId, planData);
    showToast('修改成功', 'success');
  } else {
    Store.addPlan(planData);
    showToast('新增成功', 'success');
  }

  closePlanModal();
  renderPlanPage();
}

// ========== 删除弹窗 ==========
function openDeleteModal(planId) {
  const plan = Store.getPlans().find(p => p.id === planId);
  if (!plan) return;

  planToDeleteId = planId;
  document.getElementById('delete-plan-name').textContent = plan.name;
  document.getElementById('delete-modal').classList.add('show');
}

function closeDeleteModal() {
  document.getElementById('delete-modal').classList.remove('show');
  planToDeleteId = null;
}

function confirmDelete() {
  if (planToDeleteId) {
    Store.deletePlan(planToDeleteId);
    showToast('删除成功', 'success');
    closeDeleteModal();
    renderPlanPage();
  }
}

// ========== 作废弹窗 ==========
function openCancelModal(planId) {
  const plan = Store.getPlans().find(p => p.id === planId);
  if (!plan) return;

  planToCancelId = planId;
  document.getElementById('cancel-plan-name').textContent = plan.name;
  document.getElementById('cancel-modal').classList.add('show');
}

function closeCancelModal() {
  document.getElementById('cancel-modal').classList.remove('show');
  planToCancelId = null;
}

function confirmCancel() {
  if (planToCancelId) {
    Store.cancelPlan(planToCancelId);
    showToast('已作废', 'success');
    closeCancelModal();
    renderPlanPage();
  }
}

// ========== 导出Excel ==========
function exportDetailExcel() {
  if (!selectedPlanId) return;

  const plan = Store.getPlans().find(p => p.id === selectedPlanId);
  const reports = Store.getPlanReports(selectedPlanId);

  if (reports.length === 0) {
    showToast('暂无数据，无法导出', 'warning');
    return;
  }

  try {
    const headers = ['用户姓名', '所属部门', ...plan.fields.map(f => f.name), '最后修改时间'];
    const exportData = reports.map(item => {
      const row = {
        '用户姓名': item.userName,
        '所属部门': item.department,
        '最后修改时间': formatDateTimeDisplay(item.lastModified || item.submitTime)
      };
      plan.fields.forEach(field => {
        row[field.name] = item.content[field.name] || '';
      });
      return row;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    ws['!cols'] = headers.map((_, i) => ({ wch: i === 0 ? 12 : 15 }));
    XLSX.utils.book_append_sheet(wb, ws, '填报数据');
    XLSX.writeFile(wb, `${plan.name}_填报数据.xlsx`);

    showToast(`已导出 ${reports.length} 条数据`, 'success');
  } catch (error) {
    showToast('导出失败，请重试', 'error');
  }
}

// ========== 分页组件 ==========
function renderPagination(containerId, total, current, pageSize, onChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  // 上一页
  html += `<button class="pagination-btn" onclick="window._goPage(${current - 1})" ${current === 1 ? 'disabled' : ''}>上一页</button>`;

  // 页码
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= current - 2 && i <= current + 2)) {
      html += `<button class="pagination-btn ${i === current ? 'active' : ''}" onclick="window._goPage(${i})">${i}</button>`;
    } else if (i === current - 3 || i === current + 3) {
      html += `<span style="padding:0 4px;">...</span>`;
    }
  }

  // 下一页
  html += `<button class="pagination-btn" onclick="window._goPage(${current + 1})" ${current === totalPages ? 'disabled' : ''}>下一页</button>`;
  html += `<span class="pagination-info">共 ${total} 条</span>`;

  container.innerHTML = html;

  // 保存回调
  window._goPage = onChange;
}

// ========== 事件绑定 ==========
document.addEventListener('DOMContentLoaded', () => {
  // 路由监听
  window.addEventListener('hashchange', router);

  // 填报弹窗
  document.getElementById('report-modal-close').addEventListener('click', closeReportModal);
  document.getElementById('report-modal-cancel').addEventListener('click', closeReportModal);
  document.getElementById('report-modal-submit').addEventListener('click', submitReport);
  document.getElementById('report-modal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeReportModal();
  });

  // 计划弹窗
  document.getElementById('btn-add-plan').addEventListener('click', openAddPlanModal);
  document.getElementById('plan-modal-close').addEventListener('click', closePlanModal);
  document.getElementById('plan-modal-cancel').addEventListener('click', closePlanModal);
  document.getElementById('plan-modal-submit').addEventListener('click', submitPlan);
  document.getElementById('btn-add-field').addEventListener('click', addField);
  document.getElementById('plan-modal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closePlanModal();
  });

  // 删除弹窗
  document.getElementById('delete-modal-close').addEventListener('click', closeDeleteModal);
  document.getElementById('delete-modal-cancel').addEventListener('click', closeDeleteModal);
  document.getElementById('delete-modal-confirm').addEventListener('click', confirmDelete);
  document.getElementById('delete-modal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeDeleteModal();
  });

  // 作废弹窗
  document.getElementById('cancel-modal-close').addEventListener('click', closeCancelModal);
  document.getElementById('cancel-modal-cancel').addEventListener('click', closeCancelModal);
  document.getElementById('cancel-modal-confirm').addEventListener('click', confirmCancel);
  document.getElementById('cancel-modal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeCancelModal();
  });

  // 返回列表
  document.getElementById('btn-back-list').addEventListener('click', backToList);

  // 导出
  document.getElementById('btn-export-detail').addEventListener('click', exportDetailExcel);

  // 初始化路由
  router();
});

// 暴露函数到全局
window.openReportModal = openReportModal;
window.openEditPlanModal = openEditPlanModal;
window.openDeleteModal = openDeleteModal;
window.openCancelModal = openCancelModal;
window.viewPlanDetail = viewPlanDetail;
window.removeField = removeField;
