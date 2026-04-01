<template>
    <div>
        <button @click="openPopup" class="btn btn-primary">เพิ่มรายการ</button>
        <div v-if="showPopup" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div
                class="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md relative max-h-full overflow-y-auto">
                <button @click="closePopup" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h3 class="text-lg font-bold mb-4 text-primary">เพิ่มรายการพฤติกรรม</h3>
                <!-- Step 1: เลือก/ค้นหาประเภท -->
                <div class="mb-4 relative">
                    <label class="block text-sm font-medium mb-1">ประเภทพฤติกรรม</label>
                    <input type="text" v-model="typeQuery" ref="typeInput" @input="searchTypes"
                        placeholder="ค้นหาหรือเพิ่มประเภท..." class="input input-bordered w-full"
                        @focus="typeDropdownOpen = true" @blur="handleTypeBlur" @keydown.enter="handleTypeEnter" />
                    <teleport to="body">
                        <div v-if="filteredTypes.length && typeDropdownOpen" :style="dropdownPosition('type')"
                            class="absolute left-0 right-0 top-full z-[9999] max-h-32 overflow-y-auto border rounded bg-base-100 shadow-lg">
                            <div v-for="type in filteredTypes" :key="type._id" @mousedown.prevent="selectType(type)"
                                class="px-3 py-2 cursor-pointer hover:bg-primary/10"
                                :class="selectedType && selectedType._id === type._id ? 'bg-primary/20' : ''">
                                {{ type.name }}
                            </div>
                        </div>
                    </teleport>
                    <div v-if="typeQuery && !typeExists" class="mt-2 text-xs text-green-600">สร้างประเภทใหม่: "{{
                        typeQuery }}"</div>
                </div>
                <!-- Step 2: เลือก/ค้นหาพฤติกรรม -->
                <div class="mb-4 relative" v-if="selectedType">
                    <label class="block text-sm font-medium mb-1">ชื่อพฤติกรรม</label>
                    <input type="text" v-model="behaviorQuery" ref="behaviorInput" @input="searchBehaviors"
                        placeholder="ค้นหาหรือเพิ่มพฤติกรรม..." class="input input-bordered w-full"
                        @focus="behaviorDropdownOpen = true" @blur="handleBehaviorBlur"
                        @keydown.enter="handleBehaviorEnter" />
                    <teleport to="body">
                        <div v-show="filteredBehaviors.length && behaviorDropdownOpen"
                            :style="dropdownPosition('behavior')"
                            class="dropdown-absolute z-[9999] max-h-32 overflow-y-auto border rounded bg-base-100 shadow-lg">
                            <div v-for="behavior in filteredBehaviors" :key="behavior._id"
                                @mousedown.prevent="selectBehavior(behavior)"
                                class="px-3 py-2 cursor-pointer hover:bg-primary/10"
                                :class="selectedBehavior && selectedBehavior._id === behavior._id ? 'bg-primary/20' : ''">
                                {{ behavior.name }}
                            </div>
                        </div>
                    </teleport>
                    <div v-if="behaviorQuery && !behaviorExists" class="mt-2 text-xs text-green-600">สร้างพฤติกรรมใหม่:
                        "{{ behaviorQuery }}"</div>
                </div>
                <!-- Step 3: ระดับพฤติกรรม -->
                <div v-if="selectedBehavior">
                    <label class="block text-sm font-medium mb-1">ระดับพฤติกรรม</label>
                    <div v-if="behaviorLevels.length === 0" class="text-xs text-gray-400 mb-2">ไม่มีข้อมูลระดับ</div>
                    <div v-else class="mb-2">
                        <div v-for="level in behaviorLevels" :key="level._id"
                            class="flex items-center justify-between bg-base-200 rounded px-3 py-2 mb-1">
                            <span>{{ level.level }} : {{ level.name }} (หักคะแนน: {{ level.score }})</span>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2 items-end">
                        <input type="number" v-model="newLevel.level" min="1" placeholder="ระดับ"
                            class="input input-bordered w-16 sm:w-20" />
                        <input type="text" v-model="newLevel.name" placeholder="ชื่อระดับ"
                            class="input input-bordered w-24 sm:w-32" />
                        <input type="number" v-model="newLevel.score" placeholder="คะแนน"
                            class="input input-bordered w-20 sm:w-24" />
                        <button @click="addLevel" class="btn btn-success w-full sm:w-auto mt-2 sm:mt-0"
                            :disabled="!canAddLevel">เพิ่มระดับ</button>
                    </div>
                    <div v-if="levelExists" class="text-xs text-red-500 mt-1">ระดับนี้มีอยู่แล้ว</div>
                    <div v-if="levelNameExists" class="text-xs text-red-500 mt-1">ชื่อระดับนี้มีอยู่แล้ว</div>
                </div>
                <div class="mt-6 flex justify-end">
                    <button @click="saveAll" class="btn btn-primary" :disabled="!canSave">บันทึก</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { BehaviorService } from '../../api/behavior';
import Swal from 'sweetalert2';

export default {
    name: 'CreateBehavior',
    data() {
        return {
            showPopup: false,
            typeQuery: '',
            behaviorQuery: '',
            filteredTypes: [],
            filteredBehaviors: [],
            behaviortypes: [],
            behaviors: [],
            selectedType: null,
            selectedBehavior: null,
            behaviorLevels: [],
            newLevel: { level: '', name: '', score: '' },
            service: new BehaviorService(),
            typeDropdownOpen: false,
            behaviorDropdownOpen: false,
            newLevels: [],
        };
    },
    computed: {
        typeExists() {
            return this.filteredTypes.some(t => t.name === this.typeQuery);
        },
        behaviorExists() {
            return this.filteredBehaviors.some(b => b.name === this.behaviorQuery);
        },
        levelExists() {
            return this.behaviorLevels.some(l => l.level == this.newLevel.level);
        },
        levelNameExists() {
            return this.behaviorLevels.some(l => l.name.trim() === this.newLevel.name.trim());
        },
        canAddLevel() {
            return this.newLevel.level && this.newLevel.name && this.newLevel.score && !this.levelExists && !this.levelNameExists;
        },
        canSave() {
            if (this.typeQuery && !this.typeExists && !this.selectedBehavior && !this.behaviorQuery) {
                return true;
            }
            if (this.selectedType && this.selectedType._id && !this.selectedBehavior && !this.behaviorQuery) {
                return false;
            }
            if (this.selectedType && this.behaviorQuery && !this.behaviorExists) {
                return true;
            }
            if (this.selectedType && this.selectedBehavior) {
                return true;
            }
            return false;
        },
    },
    methods: {
        openPopup() {
            this.showPopup = true;
            this.resetForm();
            this.fetchTypes();
        },
        closePopup() {
            this.showPopup = false;
        },
        resetForm() {
            this.typeQuery = '';
            this.behaviorQuery = '';
            this.filteredTypes = [];
            this.filteredBehaviors = [];
            this.selectedType = null;
            this.selectedBehavior = null;
            this.behaviorLevels = [];
            this.newLevel = { level: '', name: '', score: '' };
            this.newLevels = [];
        },
        async fetchTypes() {
            const res = await this.service.getBehaviortypes();
            this.behaviortypes = res.data || [];
            this.filteredTypes = this.behaviortypes;
        },
        searchTypes() {
            const q = this.typeQuery.toLowerCase();
            this.filteredTypes = this.behaviortypes.filter(t => t.name.toLowerCase().includes(q));
        },
        selectType(type) {
            this.selectedType = type;
            this.typeQuery = type.name;
            this.fetchBehaviors(type._id);
            this.filteredBehaviors = [];
            this.selectedBehavior = null;
            this.behaviorLevels = [];
            this.behaviorQuery = '';
            this.typeDropdownOpen = false;
        },
        handleTypeBlur() {
            setTimeout(() => {
                this.typeDropdownOpen = false;
                if (!this.typeExists && this.typeQuery) {
                    this.selectNewType();
                }
            }, 100);
        },
        selectNewType() {
            this.selectedType = { _id: null, name: this.typeQuery };
            this.filteredBehaviors = [];
            this.selectedBehavior = null;
            this.behaviorLevels = [];
            this.behaviorQuery = '';
            this.typeDropdownOpen = false;
        },
        async fetchBehaviors(typeId) {
            const res = await this.service.getBehaviorsByType(typeId);
            this.behaviors = res.data || [];
            this.filteredBehaviors = this.behaviors;
        },
        searchBehaviors() {
            const q = this.behaviorQuery.toLowerCase();
            this.filteredBehaviors = this.behaviors.filter(b => b.name.toLowerCase().includes(q));
        },
        selectBehavior(behavior) {
            this.selectedBehavior = behavior;
            this.behaviorQuery = behavior.name;
            this.fetchLevels(behavior._id);
            this.newLevel = { level: '', name: '', score: '' };
            this.behaviorDropdownOpen = false;
        },
        selectNewBehavior() {
            this.selectedBehavior = { _id: null, name: this.behaviorQuery, behaviortype_id: this.selectedType._id };
            this.behaviorLevels = [];
            this.newLevel = { level: '', name: '', score: '' };
            this.behaviorDropdownOpen = false;
        },
        handleBehaviorBlur() {
            setTimeout(() => {
                this.behaviorDropdownOpen = false;
                if (!this.behaviorExists && this.behaviorQuery) {
                    this.selectNewBehavior();
                }
            }, 100);
        },
        handleBehaviorEnter(e) {
            if (!this.behaviorExists && this.behaviorQuery) {
                this.selectNewBehavior();
                e.preventDefault();
            }
        },

        dropdownPosition(type) {
            let ref = null;
            if (type === 'type') ref = this.$refs.typeInput;
            else if (type === 'behavior') ref = this.$refs.behaviorInput;
            if (!ref) return 'position: absolute; width: 100%; left: 0; top: 0;';
            const rect = ref.getBoundingClientRect();
            return `position: absolute; left: ${rect.left + window.scrollX}px; top: ${rect.bottom + window.scrollY}px; width: ${rect.width}px;`;
        },
        async fetchLevels(behaviorId) {
            const res = await this.service.getBehaviorLevelsByBehaviorId(behaviorId);
            this.behaviorLevels = res.data || [];
            this.newLevels = [];
        },
        async addLevel() {
            if (!this.canAddLevel) return;
            this.newLevels.push({
                name: this.newLevel.name,
                score: this.newLevel.score,
                level: this.newLevel.level,
            });
            this.behaviorLevels = [...this.behaviorLevels, {
                name: this.newLevel.name,
                score: this.newLevel.score,
                level: this.newLevel.level,
            }];
            this.newLevel = { level: '', name: '', score: '' };
        },
        async saveAll() {
            let type = this.selectedType;
            if ((!type || !type._id) && this.typeQuery) {
                const res = await this.service.createBehaviortype({ name: this.typeQuery });
                type = res.data || res;
                await this.fetchTypes();
                this.selectedType = this.behaviortypes.find(t => t.name === this.typeQuery);
            }
            if (this.typeQuery && !this.typeExists && !this.selectedBehavior && !this.behaviorQuery) {
                this.closePopup();
                this.$emit('created', {
                    typeId: this.selectedType?._id || type?._id,
                    behaviorId: null,
                });
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ',
                    text: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
                });
                return;
            }
            let behavior = this.selectedBehavior;
            if ((!behavior || !behavior._id) && this.behaviorQuery && this.selectedType) {
                const data = {
                    name: this.behaviorQuery,
                    behaviortype_id: this.selectedType._id || type._id,
                };
                const res = await this.service.createBehavior(data);
                behavior = res.data || res;
                await this.fetchBehaviors(this.selectedType._id || type._id);
                this.selectedBehavior = this.behaviors.find(b => b.name === this.behaviorQuery);
            }
            if (behavior && behavior._id && this.newLevels.length > 0) {
                for (const level of this.newLevels) {
                    const data = {
                        name: level.name,
                        score: level.score,
                        level: level.level,
                        behavior_id: behavior._id,
                    };
                    await this.service.createBehaviorLevel(data);
                }
                await this.fetchLevels(behavior._id);
            }
            this.closePopup();
            this.$emit('created', {
                typeId: this.selectedType?._id || type?._id,
                behaviorId: this.selectedBehavior?._id || behavior?._id,
            });
            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                text: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
            });
        },
    },
};
</script>
<style>
.dropdown-absolute {
    position: absolute;
    z-index: 9999;
}
</style>