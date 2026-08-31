// // ============================================
// // CONFIGURAÇÃO DA API
// // ============================================
// //const API_BASE = 'https://localhost:44357/api'; // Ajuste para sua porta
// const API_BASE = 'https://localhost:7274/api'; // Ajuste para sua porta


// // ============================================
// // ESTADO DA APLICAÇÃO
// // ============================================
// const state = {
//     currentTab: 'alunos',
//     data: [],
//     filteredData: [],
//     currentPage: 1,
//     pageSize: 10,
//     editingId: null,
//     editingType: null,
// };

// // ============================================
// // DOM REFERENCES
// // ============================================
// const $ = (selector) => document.querySelector(selector);
// const $$ = (selector) => document.querySelectorAll(selector);

// const elements = {
//     tabs: $$('.nav-item'),
//     pageTitle: $('#pageTitle'),
//     tableBody: $('#tableBody'),
//     statsAlunos: $('#totalAlunos'),
//     statsProfessores: $('#totalProfessores'),
//     statsGeral: $('#totalGeral'),
//     searchInput: $('#searchInput'),
//     filterSelect: $('#filterSelect'),
//     btnAdd: $('#btnAdd'),
//     btnRefresh: $('#btnRefresh'),
//     loadingIndicator: $('#loadingIndicator'),
//     modal: $('#modal'),
//     modalTitle: $('#modalTitle'),
//     formModal: $('#formModal'),
//     formId: $('#formId'),
//     formType: $('#formType'),
//     formNome: $('#formNome'),
//     formEmail: $('#formEmail'),
//     formTelefone: $('#formTelefone'),
//     formTipo: $('#formTipo'),
//     closeModal: $('#closeModal'),
//     cancelModal: $('#cancelModal'),
//     prevPage: $('#prevPage'),
//     nextPage: $('#nextPage'),
//     pageInfo: $('#pageInfo'),
// };

// // ============================================
// // FUNÇÕES DA API
// // ============================================
// async function apiRequest(endpoint, method = 'GET', body = null) {
//     const options = {
//         method,
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     };

//     if (body) {
//         options.body = JSON.stringify(body);
//     }

//     try {
//         const response = await fetch(`${API_BASE}/${endpoint}`, options);
//         if (!response.ok) {
//             const error = await response.text();
//             throw new Error(`Erro ${response.status}: ${error}`);
//         }
//         if (method === 'DELETE' || response.status === 204) {
//             return true;
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('API Error:', error);
//         throw error;
//     }
// }

// // ============================================
// // CRUD OPERATIONS
// // ============================================
// async function fetchAlunos() {
//     return await apiRequest('Aluno');
// }

// async function fetchProfessores() {
//     return await apiRequest('Professor');
// }

// async function createAluno(data) {
//     return await apiRequest('Aluno', 'POST', data);
// }

// async function createProfessor(data) {
//     return await apiRequest('Professor', 'POST', data);
// }

// async function updateAluno(id, data) {
//     return await apiRequest(`Aluno/${id}`, 'PUT', data);
// }

// async function updateProfessor(id, data) {
//     return await apiRequest(`Professor/${id}`, 'PUT', data);
// }

// async function deleteAluno(id) {
//     return await apiRequest(`Aluno/${id}`, 'DELETE');
// }

// async function deleteProfessor(id) {
//     return await apiRequest(`Professor/${id}`, 'DELETE');
// }

// // ============================================
// // RENDER FUNCTIONS
// // ============================================
// function getBadge(type) {
//     return `<span class="badge ${type === 'aluno' ? 'badge-aluno' : 'badge-professor'}">
//         ${type === 'aluno' ? 'Aluno' : 'Professor'}
//     </span>`;
// }

// function renderTable(data) {
//     if (!data || data.length === 0) {
//         elements.tableBody.innerHTML = `
//             <tr>
//                 <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
//                     <i class="fas fa-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
//                     Nenhum registro encontrado
//                 </td>
//             </tr>
//         `;
//         return;
//     }

//     const start = (state.currentPage - 1) * state.pageSize;
//     const end = start + state.pageSize;
//     const pageData = data.slice(start, end);

//     elements.tableBody.innerHTML = pageData.map(item => `
//         <tr>
//             <td>${item.id ? item.id.substring(0, 8) : item.id}</td>
//             <td><strong>${item.nome || 'N/A'}</strong></td>
//             <td>${item.email || 'N/A'}</td>
//             <td>${item.telefone || 'N/A'}</td>
//             <td>${getBadge(item.tipo || (item.nome ? 'aluno' : 'professor'))}</td>
//             <td>
//                 <button class="action-btn btn-edit" onclick="editItem('${item.id}', '${item.tipo || 'aluno'}')">
//                     <i class="fas fa-edit"></i>
//                 </button>
//                 <button class="action-btn btn-delete" onclick="deleteItem('${item.id}', '${item.tipo || 'aluno'}')">
//                     <i class="fas fa-trash"></i>
//                 </button>
//             </td>
//         </tr>
//     `).join('');

//     // Atualiza paginação
//     const totalPages = Math.ceil(data.length / state.pageSize);
//     elements.pageInfo.textContent = `Página ${state.currentPage} de ${totalPages || 1}`;
//     elements.prevPage.disabled = state.currentPage <= 1;
//     elements.nextPage.disabled = state.currentPage >= totalPages;
// }

// function updateStats(data) {
//     const alunos = data.filter(item => item.tipo === 'aluno' || !item.tipo);
//     const professores = data.filter(item => item.tipo === 'professor');

//     elements.statsAlunos.textContent = alunos.length;
//     elements.statsProfessores.textContent = professores.length;
//     elements.statsGeral.textContent = data.length;
// }

// async function loadData() {
//     elements.loadingIndicator.style.display = 'block';

//     try {
//         const [alunos, professores] = await Promise.all([
//             fetchAlunos(),
//             fetchProfessores()
//         ]);

//         // Normaliza os dados
//         const allData = [
//             ...alunos.map(a => ({ ...a, tipo: 'aluno' })),
//             ...professores.map(p => ({ ...p, tipo: 'professor' }))
//         ];

//         state.data = allData;
//         applyFilters();
//         updateStats(allData);
//     } catch (error) {
//         showToast('Erro ao carregar dados: ' + error.message, 'error');
//     } finally {
//         elements.loadingIndicator.style.display = 'none';
//     }
// }

// function applyFilters() {
//     const searchTerm = elements.searchInput.value.toLowerCase();
//     const filterType = elements.filterSelect.value;

//     let filtered = state.data;

//     // Filtro por tipo
//     if (filterType !== 'all') {
//         filtered = filtered.filter(item => item.tipo === filterType);
//     }

//     // Filtro por busca
//     if (searchTerm) {
//         filtered = filtered.filter(item => 
//             (item.nome?.toLowerCase().includes(searchTerm) || false) ||
//             (item.email?.toLowerCase().includes(searchTerm) || false) ||
//             (item.telefone?.includes(searchTerm) || false)
//         );
//     }

//     state.filteredData = filtered;
//     state.currentPage = 1;
//     renderTable(filtered);
// }

// // ============================================
// // CRUD ACTIONS
// // ============================================
// window.editItem = function(id, tipo) {
//     const item = state.data.find(d => d.id === id);
//     if (!item) return;

//     state.editingId = id;
//     state.editingType = tipo;

//     elements.modalTitle.textContent = `✏️ Editar ${tipo === 'aluno' ? 'Aluno' : 'Professor'}`;
//     elements.formId.value = id;
//     elements.formType.value = tipo;
//     elements.formNome.value = item.nome || '';
//     elements.formEmail.value = item.email || '';
//     elements.formTelefone.value = item.telefone || '';
//     elements.formTipo.value = tipo;

//     openModal();
// };

// window.deleteItem = async function(id, tipo) {
//     if (!confirm(`Tem certeza que deseja excluir este ${tipo === 'aluno' ? 'aluno' : 'professor'}?`)) {
//         return;
//     }

//     try {
//         if (tipo === 'aluno') {
//             await deleteAluno(id);
//         } else {
//             await deleteProfessor(id);
//         }
//         showToast(`${tipo === 'aluno' ? 'Aluno' : 'Professor'} excluído com sucesso!`, 'success');
//         await loadData();
//     } catch (error) {
//         showToast('Erro ao excluir: ' + error.message, 'error');
//     }
// };

// // ============================================
// // MODAL FUNCTIONS
// // ============================================
// function openModal() {
//     elements.modal.classList.add('active');
// }

// function closeModal() {
//     elements.modal.classList.remove('active');
//     elements.formModal.reset();
//     elements.formId.value = '';
//     state.editingId = null;
//     state.editingType = null;
// }

// // ============================================
// // TOAST NOTIFICATION
// // ============================================
// function showToast(message, type = 'success') {
//     const existing = document.querySelector('.toast');
//     if (existing) existing.remove();

//     const toast = document.createElement('div');
//     toast.className = `toast toast-${type}`;
//     toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
//     document.body.appendChild(toast);

//     setTimeout(() => {
//         toast.style.opacity = '0';
//         toast.style.transform = 'translateY(20px)';
//         setTimeout(() => toast.remove(), 300);
//     }, 3000);
// }

// // ============================================
// // EVENT LISTENERS
// // ============================================
// // Navegação
// elements.tabs.forEach(tab => {
//     tab.addEventListener('click', function() {
//         elements.tabs.forEach(t => t.classList.remove('active'));
//         this.classList.add('active');

//         const tabName = this.dataset.tab;
//         state.currentTab = tabName;

//         const titles = {
//             alunos: '👨‍🎓 Alunos',
//             professores: '👨‍🏫 Professores',
//             dashboard: '📊 Dashboard'
//         };
//         elements.pageTitle.textContent = titles[tabName] || 'Dashboard';

//         // Filtra dados
//         if (tabName === 'alunos') {
//             elements.filterSelect.value = 'alunos';
//         } else if (tabName === 'professores') {
//             elements.filterSelect.value = 'professores';
//         } else {
//             elements.filterSelect.value = 'all';
//         }
//         applyFilters();
//     });
// });

// // Busca
// elements.searchInput.addEventListener('input', applyFilters);

// // Filtro
// elements.filterSelect.addEventListener('change', () => {
//     // Atualiza a aba ativa baseado no filtro
//     const value = elements.filterSelect.value;
//     if (value === 'alunos') {
//         elements.tabs.forEach(t => t.classList.remove('active'));
//         elements.tabs[0].classList.add('active');
//         state.currentTab = 'alunos';
//         elements.pageTitle.textContent = '👨‍🎓 Alunos';
//     } else if (value === 'professores') {
//         elements.tabs.forEach(t => t.classList.remove('active'));
//         elements.tabs[1].classList.add('active');
//         state.currentTab = 'professores';
//         elements.pageTitle.textContent = '👨‍🏫 Professores';
//     }
//     applyFilters();
// });

// // Botão Novo
// elements.btnAdd.addEventListener('click', () => {
//     const tipo = state.currentTab === 'professores' ? 'professor' : 'aluno';
//     elements.modalTitle.textContent = `➕ Novo ${tipo === 'aluno' ? 'Aluno' : 'Professor'}`;
//     elements.formType.value = tipo;
//     elements.formId.value = '';
//     state.editingId = null;
//     state.editingType = null;
//     elements.formModal.reset();
//     elements.formTipo.value = tipo;
//     openModal();
// });

// // Botão Refresh
// elements.btnRefresh.addEventListener('click', loadData);

// // Modal
// elements.closeModal.addEventListener('click', closeModal);
// elements.cancelModal.addEventListener('click', closeModal);
// elements.modal.addEventListener('click', (e) => {
//     if (e.target === elements.modal) closeModal();
// });

// // Form Submit
// elements.formModal.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const formData = {
//         nome: elements.formNome.value,
//         email: elements.formEmail.value,
//         telefone: elements.formTelefone.value,
//     };

//     const tipo = elements.formType.value;
//     const id = elements.formId.value;
//     const isEditing = !!id;

//     try {
//         if (isEditing) {
//             // Edição
//             if (tipo === 'aluno') {
//                 await updateAluno(id, { ...formData, id });
//             } else {
//                 await updateProfessor(id, { ...formData, id: parseInt(id) });
//             }
//             showToast(`${tipo === 'aluno' ? 'Aluno' : 'Professor'} atualizado com sucesso!`, 'success');
//         } else {
//             // Criação
//             if (tipo === 'aluno') {
//                 await createAluno({ ...formData, id: crypto.randomUUID() });
//             } else {
//                 await createProfessor(formData);
//             }
//             showToast(`${tipo === 'aluno' ? 'Aluno' : 'Professor'} criado com sucesso!`, 'success');
//         }

//         closeModal();
//         await loadData();
//     } catch (error) {
//         showToast('Erro ao salvar: ' + error.message, 'error');
//     }
// });

// // Paginação
// elements.prevPage.addEventListener('click', () => {
//     if (state.currentPage > 1) {
//         state.currentPage--;
//         renderTable(state.filteredData);
//     }
// });

// elements.nextPage.addEventListener('click', () => {
//     const totalPages = Math.ceil(state.filteredData.length / state.pageSize);
//     if (state.currentPage < totalPages) {
//         state.currentPage++;
//         renderTable(state.filteredData);
//     }
// });

// // ============================================
// // INICIALIZAÇÃO
// // ============================================
// loadData();

// // ============================================
// // UTILITY: Gerador de ID para demonstração
// // ============================================
// // Nota: Em produção, o backend gera o ID. Este é apenas para demo.
// if (!window.crypto.randomUUID) {
//     window.crypto.randomUUID = function() {
//         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//             var r = Math.random() * 16 | 0,
//                 v = c == 'x' ? r : (r & 0x3 | 0x8);
//             return v.toString(16);
//         });
//     };
// }

// console.log('🚀 Sistema de Gestão iniciado!');











// ======================================================
// SISTEMA DE GESTÃO - ALUNOS E PROFESSORES
// ======================================================

// ======================================================
// CONFIGURAÇÃO DA API
// ======================================================

const API_BASE = 'https://localhost:7274/api';


// ======================================================
// ESTADO DA APLICAÇÃO
// ======================================================

const state = {

    // Aba visual atual
    // alunos | professores | dashboard
    currentTab: 'alunos',

    // Todos os registros vindos da API
    data: [],

    // Dados atualmente filtrados
    filteredData: [],

    // Paginação
    currentPage: 1,
    pageSize: 10,

    // Controle de edição
    editingId: null,
    editingType: null
};


// ======================================================
// SELETORES
// ======================================================

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);


// ======================================================
// ELEMENTOS DO DOM
// ======================================================

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
    pageInfo: $('#pageInfo')
};


// ======================================================
// API
// ======================================================

async function apiRequest(endpoint, method = 'GET', body = null) {

    const options = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };


    if (body !== null) {

        options.body = JSON.stringify(body);

    }


    try {

        console.log(
            `[API] ${method} ${API_BASE}/${endpoint}`
        );


        const response = await fetch(
            `${API_BASE}/${endpoint}`,
            options
        );


        // DELETE ou retorno sem conteúdo
        if (
            response.status === 204 ||
            method === 'DELETE'
        ) {

            if (!response.ok) {

                throw new Error(
                    `Erro HTTP ${response.status}`
                );

            }

            return true;

        }


        const responseText = await response.text();


        if (!response.ok) {

            throw new Error(
                `Erro ${response.status}: ${responseText}`
            );

        }


        // Proteção para respostas vazias
        if (!responseText) {

            return null;

        }


        try {

            return JSON.parse(responseText);

        }
        catch {

            return responseText;

        }

    }
    catch (error) {

        console.error(
            '[API ERROR]',
            error
        );

        throw error;

    }

}


// ======================================================
// CRUD - ALUNO
// ======================================================

async function fetchAlunos() {

    return await apiRequest(
        'Aluno'
    );

}


async function createAluno(data) {

    return await apiRequest(
        'Aluno',
        'POST',
        data
    );

}


async function updateAluno(id, data) {

    return await apiRequest(
        `Aluno/${id}`,
        'PUT',
        data
    );

}


async function deleteAluno(id) {

    return await apiRequest(
        `Aluno/${id}`,
        'DELETE'
    );

}


// ======================================================
// CRUD - PROFESSOR
// ======================================================

async function fetchProfessores() {

    return await apiRequest(
        'Professor'
    );

}


async function createProfessor(data) {

    return await apiRequest(
        'Professor',
        'POST',
        data
    );

}


async function updateProfessor(id, data) {

    return await apiRequest(
        `Professor/${id}`,
        'PUT',
        data
    );

}


async function deleteProfessor(id) {

    return await apiRequest(
        `Professor/${id}`,
        'DELETE'
    );

}


// ======================================================
// BADGE
// ======================================================

function getBadge(tipo) {

    if (tipo === 'professor') {

        return `
            <span class="badge badge-professor">
                Professor
            </span>
        `;

    }


    return `
        <span class="badge badge-aluno">
            Aluno
        </span>
    `;

}


// ======================================================
// FORMATAR ID
// ======================================================

function formatId(id) {

    if (
        id === undefined ||
        id === null
    ) {

        return '-';

    }


    const value = String(id);


    if (value.length > 8) {

        return value.substring(
            0,
            8
        );

    }


    return value;

}


// ======================================================
// RENDERIZAR TABELA
// ======================================================

function renderTable(data) {

    if (!elements.tableBody) {

        console.error(
            'Elemento #tableBody não encontrado.'
        );

        return;

    }


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        elements.tableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align: center;
                        padding: 2rem;
                        color: var(--text-secondary);
                    "
                >

                    <i
                        class="fas fa-inbox"
                        style="
                            font-size: 2rem;
                            display: block;
                            margin-bottom: .5rem;
                        "
                    ></i>

                    Nenhum registro encontrado

                </td>
            </tr>
        `;


        updatePagination(
            0
        );

        return;

    }


    // ==================================================
    // PAGINAÇÃO
    // ==================================================

    const start =
        (state.currentPage - 1) *
        state.pageSize;


    const end =
        start +
        state.pageSize;


    const pageData =
        data.slice(
            start,
            end
        );


    // ==================================================
    // LINHAS
    // ==================================================

    elements.tableBody.innerHTML =
        pageData
            .map(item => {

                const id =
                    item.id ?? '';

                const tipo =
                    item.tipo === 'professor'
                        ? 'professor'
                        : 'aluno';


                return `

                    <tr>

                        <td title="${id}">
                            ${formatId(id)}
                        </td>


                        <td>
                            <strong>
                                ${escapeHtml(item.nome ?? 'N/A')}
                            </strong>
                        </td>


                        <td>
                            ${escapeHtml(item.email ?? 'N/A')}
                        </td>


                        <td>
                            ${escapeHtml(item.telefone ?? 'N/A')}
                        </td>


                        <td>
                            ${getBadge(tipo)}
                        </td>


                        <td>

                            <button
                                type="button"
                                class="action-btn btn-edit"
                                onclick="editItem('${id}', '${tipo}')"
                                title="Editar"
                            >

                                <i class="fas fa-edit"></i>

                            </button>


                            <button
                                type="button"
                                class="action-btn btn-delete"
                                onclick="deleteItem('${id}', '${tipo}')"
                                title="Excluir"
                            >

                                <i class="fas fa-trash"></i>

                            </button>

                        </td>

                    </tr>

                `;

            })
            .join('');


    updatePagination(
        data.length
    );

}


// ======================================================
// PAGINAÇÃO
// ======================================================

function updatePagination(totalItems) {

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalItems /
                state.pageSize
            )
        );


    if (
        state.currentPage >
        totalPages
    ) {

        state.currentPage =
            totalPages;

    }


    if (elements.pageInfo) {

        elements.pageInfo.textContent =
            `Página ${state.currentPage} de ${totalPages}`;

    }


    if (elements.prevPage) {

        elements.prevPage.disabled =
            state.currentPage <= 1;

    }


    if (elements.nextPage) {

        elements.nextPage.disabled =
            state.currentPage >= totalPages;

    }

}


// ======================================================
// ESTATÍSTICAS
// ======================================================

function updateStats() {

    const alunos =
        state.data.filter(
            item =>
                item.tipo === 'aluno'
        );


    const professores =
        state.data.filter(
            item =>
                item.tipo === 'professor'
        );


    if (elements.statsAlunos) {

        elements.statsAlunos.textContent =
            alunos.length;

    }


    if (elements.statsProfessores) {

        elements.statsProfessores.textContent =
            professores.length;

    }


    if (elements.statsGeral) {

        elements.statsGeral.textContent =
            state.data.length;

    }

}


// ======================================================
// CARREGAMENTO PRINCIPAL
// ======================================================

async function loadData() {

    showLoading(
        true
    );


    try {

        /*
         * Carregamos separadamente para evitar que
         * uma API com problema impeça a outra de aparecer.
         */

        let alunos = [];
        let professores = [];


        // ==================================================
        // ALUNOS
        // ==================================================

        try {

            const response =
                await fetchAlunos();


            alunos =
                Array.isArray(response)
                    ? response
                    : [];


            console.log(
                'Alunos recebidos:',
                alunos
            );

        }
        catch (error) {

            console.error(
                'Erro ao carregar alunos:',
                error
            );

        }


        // ==================================================
        // PROFESSORES
        // ==================================================

        try {

            const response =
                await fetchProfessores();


            professores =
                Array.isArray(response)
                    ? response
                    : [];


            console.log(
                'Professores recebidos:',
                professores
            );

        }
        catch (error) {

            console.error(
                'Erro ao carregar professores:',
                error
            );

        }


        // ==================================================
        // NORMALIZAÇÃO
        // ==================================================

        const alunosNormalizados =
            alunos.map(
                aluno => ({
                    ...aluno,
                    tipo: 'aluno'
                })
            );


        const professoresNormalizados =
            professores.map(
                professor => ({
                    ...professor,
                    tipo: 'professor'
                })
            );


        state.data = [

            ...alunosNormalizados,

            ...professoresNormalizados

        ];


        console.log(
            'Todos os dados:',
            state.data
        );


        // Estatísticas
        updateStats();


        // Aplicar filtro da aba atual
        applyFilters();

    }
    catch (error) {

        console.error(
            'Erro geral:',
            error
        );


        showToast(
            'Erro ao carregar os dados.',
            'error'
        );

    }
    finally {

        showLoading(
            false
        );

    }

}


// ======================================================
// FILTROS
// ======================================================

function applyFilters() {

    let filtered = [
        ...state.data
    ];


    // ==================================================
    // FILTRO PELA ABA
    // ==================================================

    if (
        state.currentTab === 'alunos'
    ) {

        filtered =
            filtered.filter(
                item =>
                    item.tipo === 'aluno'
            );

    }
    else if (
        state.currentTab === 'professores'
    ) {

        filtered =
            filtered.filter(
                item =>
                    item.tipo === 'professor'
            );

    }


    // ==================================================
    // SELECT
    // ==================================================

    if (elements.filterSelect) {

        let filterType =
            elements.filterSelect.value;


        /*
         * Aceita tanto HTML antigo:
         *
         * alunos
         * professores
         *
         * quanto HTML novo:
         *
         * aluno
         * professor
         */

        if (filterType === 'alunos') {

            filterType = 'aluno';

        }


        if (filterType === 'professores') {

            filterType = 'professor';

        }


        if (
            filterType !== 'all' &&
            filterType !== ''
        ) {

            filtered =
                filtered.filter(
                    item =>
                        item.tipo === filterType
                );

        }

    }


    // ==================================================
    // BUSCA
    // ==================================================

    const searchTerm =
        elements.searchInput
            ?.value
            ?.trim()
            ?.toLowerCase() ?? '';


    if (searchTerm) {

        filtered =
            filtered.filter(item => {

                const nome =
                    String(
                        item.nome ?? ''
                    ).toLowerCase();


                const email =
                    String(
                        item.email ?? ''
                    ).toLowerCase();


                const telefone =
                    String(
                        item.telefone ?? ''
                    ).toLowerCase();


                return (

                    nome.includes(
                        searchTerm
                    ) ||

                    email.includes(
                        searchTerm
                    ) ||

                    telefone.includes(
                        searchTerm
                    )

                );

            });

    }


    state.filteredData =
        filtered;


    renderTable(
        state.filteredData
    );

}


// ======================================================
// SELECIONAR ABA
// ======================================================

function changeTab(tabName) {

    state.currentTab =
        tabName;


    state.currentPage =
        1;


    // ==================================================
    // CLASSES CSS
    // ==================================================

    elements.tabs.forEach(tab => {

        tab.classList.remove(
            'active'
        );


        if (
            tab.dataset.tab === tabName
        ) {

            tab.classList.add(
                'active'
            );

        }

    });


    // ==================================================
    // TÍTULO
    // ==================================================

    const titles = {

        alunos:
            '👨‍🎓 Alunos',

        professores:
            '👨‍🏫 Professores',

        dashboard:
            '📊 Dashboard'

    };


    if (elements.pageTitle) {

        elements.pageTitle.textContent =
            titles[tabName] ??
            'Sistema';

    }


    // ==================================================
    // SELECT
    // ==================================================

    if (elements.filterSelect) {

        if (
            tabName === 'alunos'
        ) {

            setSelectValue(
                [
                    'aluno',
                    'alunos'
                ]
            );

        }
        else if (
            tabName === 'professores'
        ) {

            setSelectValue(
                [
                    'professor',
                    'professores'
                ]
            );

        }
        else {

            setSelectValue(
                ['all']
            );

        }

    }


    applyFilters();

}


// ======================================================
// CONFIGURAR VALUE DO SELECT
// ======================================================

function setSelectValue(values) {

    if (!elements.filterSelect) {

        return;

    }


    const availableValues =
        Array.from(
            elements.filterSelect.options
        )
            .map(
                option =>
                    option.value
            );


    const found =
        values.find(
            value =>
                availableValues.includes(
                    value
                )
        );


    if (found !== undefined) {

        elements.filterSelect.value =
            found;

    }

}


// ======================================================
// EDITAR
// ======================================================

window.editItem =
    function (id, tipo) {

        const item =
            state.data.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!item) {

            showToast(
                'Registro não encontrado.',
                'error'
            );

            return;

        }


        state.editingId =
            id;


        state.editingType =
            tipo;


        if (elements.modalTitle) {

            elements.modalTitle.textContent =
                tipo === 'aluno'
                    ? '✏️ Editar Aluno'
                    : '✏️ Editar Professor';

        }


        if (elements.formId) {

            elements.formId.value =
                item.id ?? '';

        }


        if (elements.formType) {

            elements.formType.value =
                tipo;

        }


        if (elements.formNome) {

            elements.formNome.value =
                item.nome ?? '';

        }


        if (elements.formEmail) {

            elements.formEmail.value =
                item.email ?? '';

        }


        if (elements.formTelefone) {

            elements.formTelefone.value =
                item.telefone ?? '';

        }


        if (elements.formTipo) {

            elements.formTipo.value =
                tipo;

        }


        openModal();

    };


// ======================================================
// EXCLUIR
// ======================================================

window.deleteItem =
    async function (id, tipo) {

        const label =
            tipo === 'aluno'
                ? 'aluno'
                : 'professor';


        const confirmed =
            confirm(
                `Deseja realmente excluir este ${label}?`
            );


        if (!confirmed) {

            return;

        }


        try {

            if (
                tipo === 'aluno'
            ) {

                await deleteAluno(
                    id
                );

            }
            else {

                await deleteProfessor(
                    id
                );

            }


            showToast(
                `${capitalize(label)} excluído com sucesso!`,
                'success'
            );


            await loadData();

        }
        catch (error) {

            showToast(
                `Erro ao excluir: ${error.message}`,
                'error'
            );

        }

    };


// ======================================================
// MODAL
// ======================================================

function openModal() {

    elements.modal
        ?.classList
        ?.add(
            'active'
        );

}


function closeModal() {

    elements.modal
        ?.classList
        ?.remove(
            'active'
        );


    elements.formModal
        ?.reset();


    if (elements.formId) {

        elements.formId.value = '';

    }


    state.editingId = null;
    state.editingType = null;

}


// ======================================================
// NOVO REGISTRO
// ======================================================

function openNewRecord() {

    const tipo =
        state.currentTab ===
            'professores'
            ? 'professor'
            : 'aluno';


    state.editingId = null;
    state.editingType = tipo;


    elements.formModal
        ?.reset();


    if (elements.formId) {

        elements.formId.value = '';

    }


    if (elements.formType) {

        elements.formType.value =
            tipo;

    }


    if (elements.formTipo) {

        elements.formTipo.value =
            tipo;

    }


    if (elements.modalTitle) {

        elements.modalTitle.textContent =
            tipo === 'aluno'
                ? '➕ Novo Aluno'
                : '➕ Novo Professor';

    }


    openModal();

}


// ======================================================
// SALVAR
// ======================================================

async function handleFormSubmit(event) {

    event.preventDefault();


    const nome =
        elements.formNome
            ?.value
            ?.trim() ?? '';


    const email =
        elements.formEmail
            ?.value
            ?.trim() ?? '';


    const telefone =
        elements.formTelefone
            ?.value
            ?.trim() ?? '';


    if (!nome) {

        showToast(
            'Informe o nome.',
            'error'
        );

        elements.formNome
            ?.focus();

        return;

    }


    const tipo =
        elements.formType
            ?.value ||
        state.editingType ||
        (
            state.currentTab === 'professores'
                ? 'professor'
                : 'aluno'
        );


    const id =
        elements.formId
            ?.value ??
        '';


    const isEditing =
        id !== '';


    const data = {

        nome,
        telefone,
        email

    };


    try {

        // ==================================================
        // EDIÇÃO
        // ==================================================

        if (isEditing) {

            if (
                tipo === 'aluno'
            ) {

                await updateAluno(
                    id,
                    {
                        ...data,
                        id
                    }
                );

            }
            else {

                /*
                 * Não usamos parseInt(id).
                 *
                 * Isso permite funcionar caso
                 * Professor também utilize GUID.
                 */

                await updateProfessor(
                    id,
                    {
                        ...data,
                        id
                    }
                );

            }


            showToast(
                tipo === 'aluno'
                    ? 'Aluno atualizado com sucesso!'
                    : 'Professor atualizado com sucesso!',
                'success'
            );

        }

        // ==================================================
        // NOVO
        // ==================================================

        else {

            if (
                tipo === 'aluno'
            ) {

                /*
                 * Conforme a API normalmente gera o ID,
                 * enviamos somente os dados do DTO.
                 */

                await createAluno(
                    data
                );

            }
            else {

                await createProfessor(
                    data
                );

            }


            showToast(
                tipo === 'aluno'
                    ? 'Aluno cadastrado com sucesso!'
                    : 'Professor cadastrado com sucesso!',
                'success'
            );

        }


        closeModal();


        await loadData();

    }
    catch (error) {

        console.error(
            error
        );


        showToast(
            `Erro ao salvar: ${error.message}`,
            'error'
        );

    }

}


// ======================================================
// LOADING
// ======================================================

function showLoading(show) {

    if (!elements.loadingIndicator) {

        return;

    }


    elements.loadingIndicator.style.display =
        show
            ? 'block'
            : 'none';

}


// ======================================================
// TOAST
// ======================================================

function showToast(
    message,
    type = 'success'
) {

    const existing =
        document.querySelector(
            '.toast'
        );


    if (existing) {

        existing.remove();

    }


    const toast =
        document.createElement(
            'div'
        );


    toast.className =
        `toast toast-${type}`;


    const icon =
        type === 'success'
            ? 'fa-check-circle'
            : 'fa-exclamation-circle';


    toast.innerHTML = `

        <i class="fas ${icon}"></i>

        ${escapeHtml(message)}

    `;


    document.body.appendChild(
        toast
    );


    setTimeout(() => {

        toast.style.opacity =
            '0';


        toast.style.transform =
            'translateY(20px)';


        setTimeout(
            () => toast.remove(),
            300
        );

    }, 3000);

}


// ======================================================
// SEGURANÇA HTML
// ======================================================

function escapeHtml(value) {

    const text =
        String(
            value ?? ''
        );


    return text.replace(
        /[&<>"']/g,
        character => {

            const chars = {

                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'

            };


            return chars[
                character
            ];

        }
    );

}


// ======================================================
// CAPITALIZE
// ======================================================

function capitalize(value) {

    if (!value) {

        return '';

    }


    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


// ======================================================
// EVENTOS - ABAS
// ======================================================

elements.tabs.forEach(tab => {

    tab.addEventListener(
        'click',
        function () {

            const tabName =
                this.dataset.tab;


            if (!tabName) {

                return;

            }


            changeTab(
                tabName
            );

        }
    );

});


// ======================================================
// EVENTO - BUSCA
// ======================================================

elements.searchInput
    ?.addEventListener(
        'input',
        () => {

            state.currentPage = 1;

            applyFilters();

        }
    );


// ======================================================
// EVENTO - SELECT
// ======================================================

elements.filterSelect
    ?.addEventListener(
        'change',
        () => {

            let value =
                elements.filterSelect.value;


            // Compatibilidade
            // singular/plural

            if (
                value === 'aluno' ||
                value === 'alunos'
            ) {

                changeTab(
                    'alunos'
                );

                return;

            }


            if (
                value === 'professor' ||
                value === 'professores'
            ) {

                changeTab(
                    'professores'
                );

                return;

            }


            // Todos
            state.currentTab =
                'dashboard';


            state.currentPage =
                1;


            applyFilters();

        }
    );


// ======================================================
// EVENTO - NOVO
// ======================================================

elements.btnAdd
    ?.addEventListener(
        'click',
        openNewRecord
    );


// ======================================================
// EVENTO - ATUALIZAR
// ======================================================

elements.btnRefresh
    ?.addEventListener(
        'click',
        async () => {

            await loadData();

        }
    );


// ======================================================
// EVENTOS - MODAL
// ======================================================

elements.closeModal
    ?.addEventListener(
        'click',
        closeModal
    );


elements.cancelModal
    ?.addEventListener(
        'click',
        closeModal
    );


elements.modal
    ?.addEventListener(
        'click',
        event => {

            if (
                event.target ===
                elements.modal
            ) {

                closeModal();

            }

        }
    );


// ESC fecha o modal

document.addEventListener(
    'keydown',
    event => {

        if (
            event.key === 'Escape'
        ) {

            closeModal();

        }

    }
);


// ======================================================
// EVENTO - FORMULÁRIO
// ======================================================

elements.formModal
    ?.addEventListener(
        'submit',
        handleFormSubmit
    );


// ======================================================
// EVENTO - PAGINAÇÃO ANTERIOR
// ======================================================

elements.prevPage
    ?.addEventListener(
        'click',
        () => {

            if (
                state.currentPage <= 1
            ) {

                return;

            }


            state.currentPage--;


            renderTable(
                state.filteredData
            );

        }
    );


// ======================================================
// EVENTO - PRÓXIMA PÁGINA
// ======================================================

elements.nextPage
    ?.addEventListener(
        'click',
        () => {

            const totalPages =
                Math.ceil(
                    state.filteredData.length /
                    state.pageSize
                );


            if (
                state.currentPage >=
                totalPages
            ) {

                return;

            }


            state.currentPage++;


            renderTable(
                state.filteredData
            );

        }
    );


// ======================================================
// INICIALIZAÇÃO
// ======================================================

async function init() {

    console.log(
        '🚀 Sistema de Gestão iniciado!'
    );


    console.log(
        '🌐 API:',
        API_BASE
    );


    // Aba inicial
    changeTab(
        'alunos'
    );


    // API
    await loadData();

}


// ======================================================
// INICIAR APÓS O HTML SER CARREGADO
// ======================================================

if (
    document.readyState ===
    'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        init
    );

}
else {

    init();

}