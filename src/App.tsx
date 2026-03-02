import { useState } from 'react';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AssetsTable } from './components/AssetsTable';
import { AssetProvider } from './context/AssetContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AssetProvider>
      <Layout sidebar={<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}>
        {activeTab === 'dashboard' && (
          <Dashboard />
        )}

        {activeTab === 'assets' && (
          <AssetsTable />
        )}

        {activeTab === 'markets' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Piyasalar</h2>
            <p className="text-muted-foreground">Piyasa verileri yakında...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Ayarlar</h2>
            <p className="text-muted-foreground">Ayarlar sayfası yapım aşamasında...</p>
          </div>
        )}
      </Layout>
    </AssetProvider>
  );
}

export default App;
