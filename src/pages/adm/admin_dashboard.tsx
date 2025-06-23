import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../layouts/shared/navbar';
import Select from 'react-select';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../../layouts/style/adminCharts.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D62728', '#A569BD', '#48C9B0'];

type Dinheiro = { metodo_pagamento: string; total: number };
type Roupa = { tipo: string; total: number };
type Alimento = { tipo: string; total: number };

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = process.env.VITE_API_URL;
  const token = localStorage.getItem('jwtToken');

  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Estados para guardar os dados completos vindos da API
  const [dinheiro, setDinheiro] = useState<Dinheiro[]>([]);
  const [roupas, setRoupas] = useState<Roupa[]>([]);
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);

  // Estados para guardar os dados que serão exibidos nos gráficos (já filtrados)
  const [dinheiroFiltrado, setDinheiroFiltrado] = useState<Dinheiro[]>([]);
  const [roupasFiltradas, setRoupasFiltradas] = useState<Roupa[]>([]);
  const [alimentosFiltrados, setAlimentosFiltrados] = useState<Alimento[]>([]);

  // Estados para controlar o valor selecionado em cada filtro
  const [filtroTipoDinheiro, setFiltroTipoDinheiro] = useState('todos');
  const [filtroTipoRoupa, setFiltroTipoRoupa] = useState('todas');
  const [filtroTipoAlimento, setFiltroTipoAlimento] = useState('todos');

  const [totalDinheiro, setTotalDinheiro] = useState(0);

  // Definições para as categorias de filtros
  const roupasDeFrio = ['Calça', 'Jaqueta', 'Moletom', 'Blusa', 'Cachecol', 'Gorro', 'Casaco'];
  const pagamentosOnline = ['pix', 'cartao'];
  const alimentosNaoPereciveis = ['Arroz', 'Feijão', 'Macarrão', 'Farinha', 'Açúcar', 'Óleo', 'Enlatados'];

  // Verifica se o admin está logado
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetch(`${apiUrl}/admin/check-token`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
    })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('jwtToken');
          navigate('/admin/login');
          throw new Error('Sessão expirada ou inválida.');
        }
        setIsLoading(false);
        return res.json();
      })
      .catch(() => {
        navigate('/admin/login');
      });
  }, [navigate, apiUrl, token]);

  // Função para buscar os dados iniciais da API
  const fetchData = async () => {
    setIsFetching(true);
    setFetchError(null);

    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const responses = await Promise.all([
        fetch(`${apiUrl}/api/graficos/doacoes/dinheiro`, { headers }),
        fetch(`${apiUrl}/api/graficos/doacoes/roupas`, { headers }),
        fetch(`${apiUrl}/api/graficos/doacoes/alimentos`, { headers })
      ]);

      const failedResponse = responses.find(res => !res.ok);
      if (failedResponse) throw new Error(`Erro ao buscar dados: ${failedResponse.statusText}`);

      const [dinheiroData, roupasData, alimentosData] = await Promise.all(responses.map(res => res.json()));

      const formattedDinheiro = dinheiroData.map((item: any) => ({ ...item, total: Number(item.total) }));
      setDinheiro(formattedDinheiro);
      setDinheiroFiltrado(formattedDinheiro); // Inicia com todos os dados
      setTotalDinheiro(formattedDinheiro.reduce((acc: number, cur: Dinheiro) => acc + cur.total, 0));

      const formattedRoupas = roupasData.map((item: any) => ({ ...item, total: Number(item.total) }));
      setRoupas(formattedRoupas);
      setRoupasFiltradas(formattedRoupas); // Inicia com todos os dados

      const formattedAlimentos = alimentosData.map((item: any) => ({ ...item, total: Number(item.total) }));
      setAlimentos(formattedAlimentos);
      setAlimentosFiltrados(formattedAlimentos); // Inicia com todos os dados

    } catch (error: any) {
      console.error("Erro ao buscar dados dos gráficos:", error);
      setFetchError(error.message || 'Não foi possível carregar os dados.');
    } finally {
      setIsFetching(false);
    }
  };

  // Efeito para buscar os dados apenas uma vez, quando o componente não está mais carregando
  useEffect(() => {
    if (!isLoading) {
      fetchData();
    }
  }, [isLoading]);

  // Efeito para filtrar as doações em DINHEIRO
  useEffect(() => {
    if (filtroTipoDinheiro === 'online') {
      const filtrados = dinheiro.filter(item => pagamentosOnline.includes(item.metodo_pagamento));
      setDinheiroFiltrado(filtrados);
    } else {
      setDinheiroFiltrado(dinheiro); // 'todos'
    }
  }, [dinheiro, filtroTipoDinheiro]);
  
  // Efeito para filtrar as doações de ROUPAS
  useEffect(() => {
    if (filtroTipoRoupa === 'frio') {
      const filtradas = roupas.filter(item => roupasDeFrio.includes(item.tipo));
      setRoupasFiltradas(filtradas);
    } else {
      setRoupasFiltradas(roupas); // 'todas'
    }
  }, [roupas, filtroTipoRoupa]);

  // Efeito para filtrar as doações de ALIMENTOS
  useEffect(() => {
    if (filtroTipoAlimento === 'nao-perecivel') {
      const filtrados = alimentos.filter(item => alimentosNaoPereciveis.includes(item.tipo));
      setAlimentosFiltrados(filtrados);
    } else {
      setAlimentosFiltrados(alimentos); // 'todos'
    }
  }, [alimentos, filtroTipoAlimento]);

  if (isLoading) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  if (fetchError) {
    return (
      <div className="admin-page">
        <Navbar />
        <div className="text-center mt-5" style={{ color: 'red' }}>
          <h3>Ocorreu um erro ao carregar o painel</h3>
          <p>{fetchError}</p>
          <button onClick={fetchData} disabled={isFetching} className="btn btn-primary">
            {isFetching ? 'Tentando...' : 'Tentar Novamente'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Navbar />
      <br /><br />
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <h2>Painel de Doações</h2>
        {isFetching && <p style={{ margin: 0, color: 'gray' }}>Atualizando...</p>}
      </div>

      {/* Gráfico de Dinheiro */}
      <div className="admin-chart-section">
        <div className="admin-chart-container">
          <div className="admin-chart-header">
            <Select
              className="filtro-select"
              options={[
                { value: 'todos', label: 'Todas' },
                { value: 'online', label: 'Apenas pagamentos online' }
              ]}
              defaultValue={{ value: 'todos', label: 'Todas' }}
              onChange={(e) => setFiltroTipoDinheiro(e?.value || 'todos')}
            />
            <h4 className="admin-chart-title">Doações em Dinheiro (Total: R$ {totalDinheiro.toFixed(2)})</h4>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dinheiroFiltrado}
                dataKey="total"
                nameKey="metodo_pagamento"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {dinheiroFiltrado.map((_, index) => (
                  <Cell key={`cell-din-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              <Legend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="admin-chart-container">
          <h6>Resumo:</h6>
          <ul>
            {dinheiroFiltrado.map((item, index) => (
              <li key={index} style={{ color: COLORS[index % COLORS.length] }}>
                {item.metodo_pagamento}: R$ {item.total.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gráfico de Roupas */}
      <div className="admin-chart-section">
        <div className="admin-chart-container">
          <div className="admin-chart-header">
            <Select
              className="filtro-select"
              options={[
                { value: 'todas', label: 'Todas' },
                { value: 'frio', label: 'Apenas roupas de frio' }
              ]}
              defaultValue={{ value: 'todas', label: 'Todas' }}
              onChange={(e) => setFiltroTipoRoupa(e?.value || 'todas')}
            />
            <h4 className="admin-chart-title">Doações de Roupas</h4>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roupasFiltradas}
                dataKey="total"
                nameKey="tipo"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {roupasFiltradas.map((_, index) => (
                  <Cell key={`cell-rp-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="admin-chart-container">
          <h6>Resumo:</h6>
          <ul>
            {roupasFiltradas.map((item, index) => (
              <li key={index} style={{ color: COLORS[index % COLORS.length] }}>
                {item.tipo}: {item.total} unidades
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gráfico de Alimentos */}
      <div className="admin-chart-section">
        <div className="admin-chart-container">
          <div className="admin-chart-header">
            <Select
              className="filtro-select"
              options={[
                { value: 'todos', label: 'Todos' },
                { value: 'nao-perecivel', label: 'Apenas não-perecíveis' }
              ]}
              defaultValue={{ value: 'todos', label: 'Todos' }}
              onChange={(e) => setFiltroTipoAlimento(e?.value || 'todos')}
            />
            <h4 className="admin-chart-title">Doações de Alimentos (kg)</h4>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={alimentosFiltrados}
                dataKey="total"
                nameKey="tipo"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {alimentosFiltrados.map((_, index) => (
                  <Cell key={`cell-al-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value} kg`} />
              <Legend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="admin-chart-container">
          <h6>Resumo:</h6>
          <ul>
            {alimentosFiltrados.map((item, index) => (
              <li key={index} style={{ color: COLORS[index % COLORS.length] }}>
                {item.tipo}: {item.total} kg
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;