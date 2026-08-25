// ============================================
// CONFIGURAÇÃO DA API
// ============================================
const API_BASE = 'https://localhost:44357/api'; // Ajuste para sua porta

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================
const state = {
    currentTab: 'alunos',
    data: [],
    filteredData: [],
    currentPage: 1,
    pageSize: 10,
    editingId: null,
    editingType: null,
};

// ============================================
// DOM REFERENCES
// ============================================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const elements = {
    tabs: $$('.nav-item'),
    pageTitle: $('#pageTitle'),
    tableBody: $('#tableBody'),
    statsAlunos: $('#totalAlunos'),
    statsProfessores: $('#totalProfessores'),
    statsGeral: $('#totalGeral'),
    searchInput: $('#searchInput'),
    filterSelect: $('#filterSelect'),
    btnAdd: $('#btnAdd'),
    btnRefresh: $('#btnRefresh'),
    loadingIndicator: $('#loadingIndicator'),
    modal: $('#modal'),
    modalTitle: $('#modalTitle'),
    formModal: $('#formModal'),
    formId: $('#formId'),
    formType: $('#formType'),
    formNome: $('#formNome'),
    formEmail: $('#formEmail'),
    formTelefone: $('#formTelefone'),
    formTipo: $('#formTipo'),
    closeModal: $('#closeModal'),
    cancelModal: $('#cancelModal'),
    prevPage: $('#prevPage'),
    nextPage: $('#nextPage'),
    pageInfo: $('#pageInfo'),
};

// ============================================
// FUNÇÕES DA API
// ============================================
async function apiRequest(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE}/${endpoint}`, options);
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ${response.status}: ${error}`);
        }
        if (method === 'DELETE' || response.status === 204) {
            return true;
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================
// CRUD OPERATIONS
// ============================================
async function fetchAlunos() {
    return await apiRequest('Aluno');
}

async function fetchProfessores() {
    return await apiRequest('Professor');
}

async function createAluno(data) {
    return await apiRequest('Aluno', 'POST', data);
}

async function createProfessor(data) {
    return await apiRequest('Professor', 'POST', data);
}

async function updateAluno(id, data) {
    return await apiRequest(`Aluno/${id}`, 'PUT', data);
}

async function updateProfessor(id, data) {
    return await apiRequest(`Professor/${id}`, 'PUT', data);
}

async function deleteAluno(id) {
    return await apiRequest(`Aluno/${id}`, 'DELETE');
}

async function deleteProfessor(id) {
    return await apiRequest(`Professor/${id}`, 'DELETE');
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function getBadge(type) {
    return `<span class="badge ${type === 'aluno' ? 'badge-aluno' : 'badge-professor'}">
        ${type === 'aluno' ? 'Aluno' : 'Professor'}
    </span>`;
}

function renderTable(data) {
    if (!data || data.length === 0) {
        elements.tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
                    Nenhum registro encontrado
                </td>
            </tr>
        `;
        return;
    }

    const start = (state.currentPage - 1) * state.pageSize;
    const end = start + state.pageSize;
    const pageData = data.slice(start, end);

    elements.tableBody.innerHTML = pageData.map(item => `
        <tr>
            <td>${item.id ? item.id.substring(0, 8) : item.id}</td>
            <td><strong>${item.nome || 'N/A'}</strong></td>
            <td>${item.email || 'N/A'}</td>
            <td>${item.telefone || 'N/A'}</td>
            <td>${getBadge(item.tipo || (item.nome ? 'aluno' : 'professor'))}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editItem('${item.id}', '${item.tipo || 'aluno'}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="deleteItem('${item.id}', '${item.tipo || 'aluno'}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Atualiza paginação
    const totalPages = Math.ceil(data.length / state.pageSize);
    elements.pageInfo.textContent = `Página ${state.currentPage} de ${totalPages || 1}`;
    elements.prevPage.disabled = state.currentPage <= 1;
    elements.nextPage.disabled = state.currentPage >= totalPages;
}

function updateStats(data) {
    const alunos = data.filter(item => item.tipo === 'aluno' || !item.tipo);
    const professores = data.filter(item => item.tipo === 'professor');
    
    elements.statsAlunos.textContent = alunos.length;
    elements.statsProfessores.textContent = professores.length;
    elements.statsGeral.textContent = data.length;
}

async function loadData() {
    elements.loadingIndicator.style.display = 'block';
    
    try {
        const [alunos, professores] = await Promise.all([
            fetchAlunos(),
            fetchProfessores()
        ]);

        // Normaliza os dados
        const allData = [
            ...alunos.map(a => ({ ...a, tipo: 'aluno' })),
            ...professores.map(p => ({ ...p, tipo: 'professor' }))
        ];

        state.data = allData;
        applyFilters();
        updateStats(allData);
    } catch (error) {
        showToast('Erro ao carregar dados: ' + error.message, 'error');
    } finally {
        elements.loadingIndicator.style.display = 'none';
    }
}

function applyFilters() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const filterType = elements.filterSelect.value;

    let filtered = state.data;

    // Filtro por tipo
    if (filterType !== 'all') {
        filtered = filtered.filter(item => item.tipo === filterType);
    }

    // Filtro por busca
    if (searchTerm) {
        filtered = filtered.filter(item => 
            (item.nome?.toLowerCase().includes(searchTerm) || false) ||
            (item.email?.toLowerCase().includes(searchTerm) || false) ||
            (item.telefone?.includes(searchTerm) || false)
        );
    }

    state.filteredData = filtered;
    state.currentPage = 1;
    renderTable(filtered);
}

// ============================================
// CRUD ACTIONS
// ============================================
window.editItem = function(id, tipo) {
    const item = state.data.find(d => d.id === id);
    if (!item) return;

    state.editingId = id;
    state.editingType = tipo;

    elements.modalTitle.textContent = `✏️ Editar ${tipo === 'aluno' ? 'Aluno' : 'Professor'}`;
    elements.formId.value = id;
    elements.formType.value = tipo;
    elements.formNome.value = item.nome || '';
    elements.formEmail.value = item.email || '';
    elements.formTelefone.value = item.telefone || '';
    elements.formTipo.value = tipo;

    openModal();
};

window.deleteItem = async function(id, tipo) {
    if (!confirm(`Tem certeza que deseja excluir este ${tipo === 'aluno' ? 'aluno' : 'professor'}?`)) {
        return;
    }

    try {
        if (tipo === 'aluno') {
            await deleteAluno(id);
        } else {
            await deleteProfessor(id);
        }
        showToast(`${tipo === 'aluno' ? 'Aluno' : 'Professor'} excluído com sucesso!`, 'success');
        await loadData();
    } catch (error) {
        showToast('Erro ao excluir: ' + error.message, 'error');
    }
};

// ============================================
// MODAL FUNCTIONS
// ============================================
function openModal() {
    elements.modal.classList.add('active');
}

function closeModal() {
    elements.modal.classList.remove('active');
    elements.formModal.reset();
    elements.formId.value = '';
    state.editingId = null;
    state.editingType = null;
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// EVENT LISTENERS
// ============================================
// Navegação
elements.tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        elements.tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const tabName = this.dataset.tab;
        state.currentTab = tabName;
        
        const titles = {
            alunos: '👨‍🎓 Alunos',
            professores: '👨‍🏫 Professores',
            dashboard: '📊 Dashboard'
        };
        elements.pageTitle.textContent = titles[tabName] || 'Dashboard';
        
        // Filtra dados
        if (tabName === 'alunos') {
            elements.filterSelect.value = 'alunos';
        } else if (tabName === 'professores') {
            elements.filterSelect.value = 'professores';
        } else {
            elements.filterSelect.value = 'all';
        }
        applyFilters();
    });
});

// Busca
elements.searchInput.addEventListener('input', applyFilters);

// Filtro
elements.filterSelect.addEventListener('change', () => {
    // Atualiza a aba ativa baseado no filtro
    const value = elements.filterSelect.value;
    if (value === 'alunos') {
        elements.tabs.forEach(t => t.classList.remove('active'));
        elements.tabs[0].classList.add('active');
        state.currentTab = 'alunos';
        elements.pageTitle.textContent = '👨‍🎓 Alunos';
    } else if (value === 'professores') {
        elements.tabs.forEach(t => t.classList.remove('active'));
        elements.tabs[1].classList.add('active');
        state.currentTab = 'professores';
        elements.pageTitle.textContent = '👨‍🏫 Professores';
    }
    applyFilters();
});

// Botão Novo
elements.btnAdd.addEventListener('click', () => {
    const tipo = state.currentTab === 'professores' ? 'professor' : 'aluno';
    elements.modalTitle.textContent = `➕ Novo ${tipo === 'aluno' ? 'Aluno' : 'Professor'}`;
    elements.formType.value = tipo;
    elements.formId.value = '';
    state.editingId = null;
    state.editingType = null;
    elements.formModal.reset();
    elements.formTipo.value = tipo;
    openModal();
});

// Botão Refresh
elements.btnRefresh.addEventListener('click', loadData);

// Modal
elements.closeModal.addEventListener('click', closeModal);
elements.cancelModal.addEventListener('click', closeModal);
elements.modal.addEventListener('click', (e) => {
    if (e.target === elements.modal) closeModal();
});

// Form Submit
elements.formModal.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        nome: elements.formNome.value,
        email: elements.formEmail.value,
        telefone: elements.formTelefone.value,
    };

    const tipo = elements.formType.value;
    const id = elements.formId.value;
    const isEditing = !!id;

    try {
        if (isEditing) {
            // Edição
            if (tipo === 'aluno') {
                await updateAluno(id, { ...formData, id });
            } else {
                await updateProfessor(id, { ...formData, id: parseInt(id) });
            }
            showToast(`${tipo === 'aluno' ? 'Aluno' : 'Professor'} atualizado com sucesso!`, 'success');
        } else {
            // Criação
            if (tipo === 'aluno') {
                await createAluno({ ...formData, id: crypto.randomUUID() });
            } else {
                await createProfessor(formData);
            }
            showToast(`${tipo === 'aluno' ? 'Aluno' : 'Professor'} criado com sucesso!`, 'success');
        }

        closeModal();
        await loadData();
    } catch (error) {
        showToast('Erro ao salvar: ' + error.message, 'error');
    }
});

// Paginação
elements.prevPage.addEventListener('click', () => {
    if (state.currentPage > 1) {
        state.currentPage--;
        renderTable(state.filteredData);
    }
});

elements.nextPage.addEventListener('click', () => {
    const totalPages = Math.ceil(state.filteredData.length / state.pageSize);
    if (state.currentPage < totalPages) {
        state.currentPage++;
        renderTable(state.filteredData);
    }
});

// ============================================
// INICIALIZAÇÃO
// ============================================
loadData();

// ============================================
// UTILITY: Gerador de ID para demonstração
// ============================================
// Nota: Em produção, o backend gera o ID. Este é apenas para demo.
if (!window.crypto.randomUUID) {
    window.crypto.randomUUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
}

console.log('🚀 Sistema de Gestão iniciado!');