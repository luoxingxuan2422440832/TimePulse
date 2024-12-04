<template>

  <div class="d-flex flex-column align-items-center container-all" style="min-height: 80vh;">
    <div style="display: none">
      <button @click="sendNotification">发送系统通知</button>
    </div>
    <div class="container mt-3" style="width: 100%; max-width: 800px; ">
      <!-- TimePulse 标题 -->
      <h1 class="text-center" @click="showImportExportModal">TimePulse</h1>

      <!-- 导入导出模态框 -->
      <div class="modal fade" id="importExportModal" tabindex="-1" aria-labelledby="importExportModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="importExportModalLabel">选择操作</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
              <button class="btn btn-success me-2" @click="exportData">导出数据</button>
              <button class="btn btn-info me-2" @click="importData">导入数据</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 表格 -->
      <table class="table table-striped table-responsive">
        <thead>
        <tr>
          <th>时间区间</th>
          <th>任务描述</th>
          <th>任务优先级</th>
          <th>被打断次数</th>
          <th>能量水平</th>
          <th>情绪状态</th>
          <th>小结</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(record, index) in timeRecords" :key="index">
          <td>{{ record.timeInterval }}</td>
          <td>{{ record.taskDescription }}</td>
          <td>{{ record.priority }}</td>
          <td>{{ record.interruptions }}</td>
          <td>{{ record.energyLevel }}</td>
          <td>{{ record.mood }}</td>
          <td>{{ record.summary }}</td>
          <td>
            <button class="btn btn-primary btn-sm" @click="editRecord(record)">编辑</button>
            <button class="btn btn-danger btn-sm ms-2" @click="deleteRecord(index)">删除</button>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- 新增记录按钮 -->
      <div class="text-center mt-3">
        <button class="btn btn-success btn-sm" @click="addNewRecord">增添新列</button>
      </div>

      <!-- 弹窗表单 -->
      <div class="modal fade" id="timeRecordModal" tabindex="-1" aria-labelledby="timeRecordModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="timeRecordModalLabel">填写时间记录</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-1">
                  <label for="taskDescription" class="form-label">任务描述</label>
                  <textarea v-model="form.taskDescription" class="form-control" id="taskDescription" rows="2"></textarea>
                </div>

                <div class="mb-1">
                  <label class="form-label">任务优先级</label>
                  <div class="d-flex flex-wrap gap-2">
                    <div class="form-check form-check-inline">
                      <input v-model="form.priority" class="form-check-input" type="radio" name="priority" id="priorityHigh" value="高">
                      <label class="form-check-label" for="priorityHigh">高</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input v-model="form.priority" class="form-check-input" type="radio" name="priority" id="priorityMedium" value="中">
                      <label class="form-check-label" for="priorityMedium">中</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input v-model="form.priority" class="form-check-input" type="radio" name="priority" id="priorityLow" value="低">
                      <label class="form-check-label" for="priorityLow">低</label>
                    </div>
                  </div>
                </div>

                <div class="mb-1">
                  <label class="form-label">被打断次数</label>
                  <div class="d-flex flex-wrap gap-2">
                    <div v-for="n in 6" :key="n" class="form-check form-check-inline">
                      <input v-model="form.interruptions" class="form-check-input" type="radio" :name="`interruptions-${n}`" :id="`interruptions${n - 1}`" :value="n - 1">
                      <label class="form-check-label" :for="`interruptions${n - 1}`">{{ n - 1 }}</label>
                    </div>
                  </div>
                </div>

                <div class="mb-1">
                  <label class="form-label">能量水平</label>
                  <div class="d-flex flex-wrap gap-2">
                    <div v-for="n in 5" :key="n" class="form-check form-check-inline">
                      <input v-model="form.energyLevel" class="form-check-input" type="radio" :name="`energyLevel-${n}`" :id="`energyLevel${n}`" :value="n">
                      <label class="form-check-label" :for="`energyLevel${n}`">{{ n }}</label>
                    </div>
                  </div>
                </div>

                <div class="mb-1">
                  <label class="form-label">情绪状态</label>
                  <div class="d-flex flex-wrap gap-2">
                    <div class="form-check form-check-inline">
                      <input v-model="form.mood" class="form-check-input" type="radio" name="mood" id="moodPositive" value="积极">
                      <label class="form-check-label" for="moodPositive">积极</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input v-model="form.mood" class="form-check-input" type="radio" name="mood" id="moodNeutral" value="中立">
                      <label class="form-check-label" for="moodNeutral">中立</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input v-model="form.mood" class="form-check-input" type="radio" name="mood" id="moodNegative" value="消极">
                      <label class="form-check-label" for="moodNegative">消极</label>
                    </div>
                  </div>
                </div>

                <div class="mb-1">
                  <label for="summary" class="form-label">小结</label>
                  <textarea v-model="form.summary" class="form-control" id="summary" rows="2"></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
              <button type="button" class="btn btn-primary" @click="saveRecord">保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {nextTick, onMounted, ref} from 'vue';
import { Modal } from 'bootstrap';

export default {
  setup() {
    const timeRecords = ref([]);
    const form = ref({
      timeInterval: '',
      taskDescription: '',
      priority: '',
      interruptions: '',
      energyLevel: '',
      mood: '',
      summary: ''
    });

    const modal = ref(null);
    const importExportModal = ref(null); // 引用导入导出模态框
    // 自动生成时间段
    const generateTimeInterval = () => {
      const now = new Date();
      const start = new Date(now.setMinutes(Math.floor(now.getMinutes() / 30) * 30));
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    // 编辑记录
    const editRecord = (record) => {
      form.value = { ...record };
      modal.value.show();
    };

    // 增添新列
    const addNewRecord = () => {
      // 生成新的时间区间
      form.value.timeInterval = generateTimeInterval();
      // 显示模态框
      modal.value.show();
    };

    const NOTIFICATION_TITLE = 'timePulse';
    const NOTIFICATION_BODY = '小结这半小时状态吧';


    function sendNotification () {
      const myNotification = new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY,silent:true });
      myNotification.onclick = () => {
        console.log('通知被点击')
      }
    }


    // 计算下一次触发的时间
    const getNextTriggerTime = () => {
      const now = new Date();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();

      // 找到下一个 25 分或 55 分的时间点
      let nextMinutes = 25;
      if (currentMinutes >= 25 && currentMinutes < 55) {
        nextMinutes = 55;
      } else if (currentMinutes >= 55) {
        nextMinutes = 85; // 85 分钟会自动归为下一小时的 25 分
      }

      // 创建目标时间
      const targetTime = new Date(now);
      targetTime.setMinutes(nextMinutes);
      targetTime.setSeconds(0);

      // 如果目标时间已经过去，调整到下一小时
      if (targetTime <= now) {
        targetTime.setHours(targetTime.getHours() + 1);
        targetTime.setMinutes(nextMinutes === 85 ? 25 : nextMinutes);
      }

      return targetTime;
    };

    const setTimeout_times=ref({});
    // 安排下一次触发
    const scheduleNextTrigger = () => {
      const targetTime = getNextTriggerTime();
      const delay = targetTime - new Date();
    // 检查 setTimeout_times 中是否存在 targetTime
      if (setTimeout_times.value[targetTime]) {
        setTimeout_times.value[targetTime] += 1;
      } else {
        setTimeout_times.value[targetTime] = 0;
      }

      // 取消之前的定时器（如果有）
      if (typeof setTimeout_times.value[targetTime] === 'number') {
        clearTimeout(setTimeout_times.value[targetTime]);
      }
      setTimeout_times.value[targetTime] = setTimeout(() => {
        showFormAtSpecificTime(targetTime);
        sendNotification();
      }, delay);

    };

    // 加载本地存储的数据
    onMounted(() => {
      timeRecords.value = JSON.parse(localStorage.getItem('timeRecords')) || [];

      modal.value = new Modal(document.getElementById('timeRecordModal'));
      scheduleNextTrigger();
    });

    // 保存数据到本地存储
    const saveRecord = () => {
      const newRecord = { ...form.value };
      const index = timeRecords.value.findIndex(record => record.timeInterval === newRecord.timeInterval);

      if (index !== -1) {
        timeRecords.value[index] = newRecord;
      } else {
        timeRecords.value.push(newRecord);
      }
      timeRecords.value.push(newRecord);

      // 保存到本地存储
      localStorage.setItem('timeRecords', JSON.stringify(timeRecords.value));

      modal.value.hide();
      form.value = {};
    };

    // 删除数据并更新本地存储
    const deleteRecord = (index) => {
      timeRecords.value.splice(index, 1);
      localStorage.setItem('timeRecords', JSON.stringify(timeRecords.value));
    };

    const isModalVisible = ref(false);

    const showFormAtSpecificTime = (targetTime) => {
      const now = new Date();
      if (now >= targetTime && !isModalVisible.value) {
        isModalVisible.value = true;
        form.value.timeInterval = generateTimeInterval();
        modal.value.show();
        // 设置下一次触发时间
        scheduleNextTrigger();
      }
    };

    // 在模态框关闭时重置标志位
    // modal.value.addEventListener('hidden.bs.modal', () => {
    //   isModalVisible.value = false;
    // });
// 初始化模态框
    onMounted(() => {
      nextTick(() => {
        modal.value = new Modal(document.getElementById('timeRecordModal'));
        // 添加事件监听器以重置标志位
        if (modal.value) {
          modal.value._element.addEventListener('hidden.bs.modal', () => {
            isModalVisible.value = false;
          });
        }
      });

      // 立即安排第一次触发
      scheduleNextTrigger();
    });

    // 显示导入导出模态框
    const showImportExportModal = () => {
      importExportModal.value.show();
    };

    // 导出数据为 JSON 文件
    const exportData = () => {
      const json = JSON.stringify(timeRecords.value, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = href;
      link.download = 'time_records.json';
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      // 关闭模态框
      importExportModal.value.hide();
    };

    // 导入 JSON 数据
    const importData = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const text = await file.text();
          try {
            const importedData = JSON.parse(text);
            timeRecords.value = importedData;
            localStorage.setItem('timeRecords', JSON.stringify(importedData));
            alert('数据导入成功！');
          } catch (error) {
            alert('导入失败，请确保文件是有效的 JSON 格式。');
          }
        }
        // 关闭模态框
        importExportModal.value.hide();
      };
      input.click();
    };

    // 初始化模态框
    onMounted(() => {
      timeRecords.value = JSON.parse(localStorage.getItem('timeRecords')) || [];
      importExportModal.value = new Modal(document.getElementById('importExportModal'));
    });

    return {
      timeRecords,
      form,
      editRecord,
      saveRecord,
      addNewRecord,
      deleteRecord,
      showImportExportModal, // 显示导入导出模态框
      exportData, // 导出数据
      importData, // 导入数据
      sendNotification,
    };
  }
};
</script>

<style scoped>
/* 添加一些自定义样式 */
.btn-success  btn-info {
  margin-top: 10px;
}

.btn-danger {
  margin-left: 5px;
}

/* 使标题居中 */
h1.text-center {
  margin-bottom: 20px;
}

/* 使新增记录按钮居中 */
.text-center {
  text-align: center;
}

/* 限制表格的最大宽度 */
.table-responsive {
  max-width: 100%;
}

/* 使模态框中的按钮居中 */
.modal-body {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* 调整按钮大小 */
.btn {
  padding: 8px 16px;
  font-size: 14px;
}
.container-all{
  margin-top: -3vh;
}
</style>