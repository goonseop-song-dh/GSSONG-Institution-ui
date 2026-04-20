import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import InstitutionList from './pages/institutions/InstitutionList';
import InstitutionDetail from './pages/institutions/InstitutionDetail';
import InstitutionForm from './pages/institutions/InstitutionForm';
import TypeList from './pages/institution-types/TypeList';
import TypeDetail from './pages/institution-types/TypeDetail';
import TypeForm from './pages/institution-types/TypeForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/institutions" replace />} />

          <Route path="/institutions" element={<InstitutionList />} />
          <Route path="/institutions/new" element={<InstitutionForm />} />
          <Route path="/institutions/:id" element={<InstitutionDetail />} />
          <Route path="/institutions/:id/edit" element={<InstitutionForm />} />

          <Route path="/institution-types" element={<TypeList />} />
          <Route path="/institution-types/new" element={<TypeForm />} />
          <Route path="/institution-types/:id" element={<TypeDetail />} />
          <Route path="/institution-types/:id/edit" element={<TypeForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}