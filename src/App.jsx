import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp, Filter, Search, X, Menu, User, Users, Clock, CheckCircle, AlertTriangle, PlusCircle, ArrowRight, Briefcase, Settings, LogOut } from 'lucide-react';

// Mock Data (Dane przykładowe)
const mockOrders = [
  { id: 1, customer: 'Firma A', title: 'Stworzenie strony www', status: 'Nowe', priority: 'Wysoki', assignedTo: [1, 2], deadline: '2025-05-10', created: '2025-04-18', description: 'Zaprojektowanie i wdrożenie responsywnej strony internetowej opartej na najnowszych technologiach.' },
  { id: 2, customer: 'Klient B', title: 'Aplikacja mobilna', status: 'W trakcie', priority: 'Krytyczny', assignedTo: [3], deadline: '2025-04-25', created: '2025-04-10', description: 'Rozwój natywnej aplikacji mobilnej dla platformy iOS i Android.' },
  { id: 3, customer: 'Organizacja C', title: 'Optymalizacja SEO', status: 'Wykonane', priority: 'Średni', assignedTo: [4, 1], deadline: '2025-04-15', created: '2025-03-20', description: 'Audyt SEO i wdrożenie rekomendacji w celu poprawy widoczności w wyszukiwarkach.' },
  { id: 4, customer: 'Spółka D', title: 'Kampania marketingowa', status: 'Opóźnione', priority: 'Niski', assignedTo: [2], deadline: '2025-04-01', created: '2025-03-05', description: 'Zaplanowanie i realizacja kampanii marketingowej w mediach społecznościowych.' },
  { id: 5, customer: 'Firma E', title: 'Integracja API', status: 'W trakcie', priority: 'Wysoki', assignedTo: [3, 5], deadline: '2025-05-01', created: '2025-04-12', description: 'Połączenie systemu CRM z zewnętrznym dostawcą danych przez API.' },
  { id: 6, customer: 'Klient F', title: 'Projekt graficzny logo', status: 'Nowe', priority: 'Średni', assignedTo: [], deadline: '2025-05-15', created: '2025-04-19', description: 'Stworzenie nowego logo i identyfikacji wizualnej dla marki.' },
  { id: 7, customer: 'Firma G', title: 'Szkolenie zespołu', status: 'Wykonane', priority: 'Niski', assignedTo: [1], deadline: '2025-04-18', created: '2025-04-02', description: 'Przeprowadzenie szkolenia z zakresu nowych narzędzi wewnętrznych.' },
];

const mockEmployees = [
  { id: 1, name: 'Anna Kowalska', avatar: 'AK', role: 'Project Manager' },
  { id: 2, name: 'Piotr Nowak', avatar: 'PN', role: 'Frontend Developer' },
  { id: 3, name: 'Ewa Zalewska', avatar: 'EZ', role: 'Backend Developer' },
  { id: 4, name: 'Tomasz Wiśniewski', avatar: 'TW', role: 'SEO Specialist' },
  { id: 5, name: 'Magdalena Szymańska', avatar: 'MS', role: 'UI/UX Designer' },
];

// Dane do wykresów (Chart Data)
const chartDataWeekly = [
  { name: 'Pon', Nowe: 4, Wykonane: 2 },
  { name: 'Wt', Nowe: 3, Wykonane: 1 },
  { name: 'Śr', Nowe: 2, Wykonane: 3 },
  { name: 'Czw', Nowe: 2, Wykonane: 4 },
  { name: 'Pt', Nowe: 1, Wykonane: 3 },
  { name: 'Sob', Nowe: 0, Wykonane: 1 },
  { name: 'Ndz', Nowe: 0, Wykonane: 0 },
];

const chartDataMonthly = [
  { name: 'Tydz 1', Zlecenia: 30 },
  { name: 'Tydz 2', Zlecenia: 45 },
  { name: 'Tydz 3', Zlecenia: 28 },
  { name: 'Tydz 4', Zlecenia: 55 },
];

// Helper Function to get status color (Funkcja pomocnicza do kolorów statusu)
const getStatusColor = (status) => {
  switch (status) {
    case 'Nowe': return 'bg-blue-100 text-blue-800';
    case 'W trakcie': return 'bg-yellow-100 text-yellow-800';
    case 'Wykonane': return 'bg-green-100 text-green-800';
    case 'Opóźnione': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Helper Function to get priority color (Funkcja pomocnicza do kolorów priorytetu)
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'Niski': return 'text-green-600';
        case 'Średni': return 'text-yellow-600';
        case 'Wysoki': return 'text-orange-600';
        case 'Krytyczny': return 'text-red-600';
        default: return 'text-gray-600';
    }
};

// Employee Avatar Component (Komponent Awatara Pracownika)
const EmployeeAvatar = ({ employeeId, size = 'md' }) => {
  const employee = mockEmployees.find(emp => emp.id === employeeId);
  if (!employee) return null;

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${sizeClasses[size]} overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-sm group transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`}
      title={employee.name}
    >
      <span className="font-medium text-white">{employee.avatar}</span>
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 ease-in-out"></div>
    </div>
  );
};

// Dashboard Summary Card Component (Komponent Karty Podsumowania Dashboardu)
const SummaryCard = ({ title, value, icon, color, change }) => {
  const IconComponent = icon;
  return (
    <div className={`bg-white rounded-xl shadow-lg p-5 transform transition duration-500 ease-out hover:scale-105 hover:shadow-xl border-l-4 ${color} flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
        <IconComponent className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {change && (
        <p className={`text-xs mt-1 ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change > 0 ? `+${change}` : change}% vs poprzedni tydzień
        </p>
      )}
    </div>
  );
};

// Order Table Component (Komponent Tabeli Zleceń)
const OrderTable = ({ orders, onSelectOrder, onAssignTask }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [filterText, setFilterText] = useState('');
  const [expandedRowId, setExpandedRowId] = useState(null);

  const sortedOrders = useMemo(() => {
    let sortableItems = [...orders];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [orders, sortConfig]);

  const filteredOrders = useMemo(() => {
    return sortedOrders.filter(order =>
      order.title.toLowerCase().includes(filterText.toLowerCase()) ||
      order.customer.toLowerCase().includes(filterText.toLowerCase()) ||
      order.status.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [sortedOrders, filterText]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="w-4 h-4 inline ml-1 opacity-30" />;
    }
    return sortConfig.direction === 'ascending' ?
      <ChevronUp className="w-4 h-4 inline ml-1" /> :
      <ChevronDown className="w-4 h-4 inline ml-1" />;
  };

  const toggleRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-gray-700">Lista Zleceń</h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Filtruj zlecenia..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Ukryj ID na mniejszych ekranach */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer hover:bg-gray-100" onClick={() => requestSort('id')}>
                ID {getSortIcon('id')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('title')}>
                Tytuł {getSortIcon('title')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell cursor-pointer hover:bg-gray-100" onClick={() => requestSort('customer')}>
                Klient {getSortIcon('customer')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('status')}>
                Status {getSortIcon('status')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer hover:bg-gray-100" onClick={() => requestSort('priority')}>
                Priorytet {getSortIcon('priority')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Przypisani
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell cursor-pointer hover:bg-gray-100" onClick={() => requestSort('deadline')}>
                Termin {getSortIcon('deadline')}
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Akcje</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer" onClick={() => toggleRow(order.id)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden md:table-cell">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                   <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium hidden md:table-cell ${getPriorityColor(order.priority)}`}>{order.priority}</td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="flex -space-x-2 overflow-hidden">
                        {order.assignedTo.slice(0, 3).map(empId => <EmployeeAvatar key={empId} employeeId={empId} size="sm" />)}
                        {order.assignedTo.length > 3 && (
                            <div className="relative inline-flex items-center justify-center w-6 h-6 text-xs overflow-hidden bg-gray-300 rounded-full shadow-sm">
                                <span className="font-medium text-gray-700">+{order.assignedTo.length - 3}</span>
                            </div>
                        )}
                         {order.assignedTo.length === 0 && (
                             <span className="text-xs text-gray-400 italic">Brak</span>
                         )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{order.deadline}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <button
                        onClick={(e) => { e.stopPropagation(); onSelectOrder(order); }}
                        className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out mr-2"
                        title="Zobacz szczegóły"
                    >
                       <ArrowRight className="w-5 h-5"/>
                    </button>
                     <button
                        onClick={(e) => { e.stopPropagation(); toggleRow(order.id); }}
                        className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
                        title={expandedRowId === order.id ? "Zwiń szczegóły" : "Rozwiń szczegóły"}
                    >
                        {expandedRowId === order.id ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                    </button>
                  </td>
                </tr>
                {/* Expanded Row Content (Zawartość Rozwiniętego Wiersza) */}
                {expandedRowId === order.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="8" className="px-6 py-4">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-down transition duration-300 ease-in-out">
                           <div>
                               <h4 className="text-sm font-semibold text-gray-700 mb-1">Opis</h4>
                               <p className="text-sm text-gray-600">{order.description}</p>
                           </div>
                           <div>
                               <h4 className="text-sm font-semibold text-gray-700 mb-1">Przypisani pracownicy</h4>
                               <div className="flex flex-wrap gap-2">
                                   {order.assignedTo.length > 0 ? (
                                        order.assignedTo.map(empId => {
                                            const emp = mockEmployees.find(e => e.id === empId);
                                            return emp ? (
                                                <div key={empId} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium group">
                                                    <EmployeeAvatar employeeId={empId} size="sm" />
                                                    <span className="ml-1.5">{emp.name}</span>
                                                </div>
                                            ) : null;
                                        })
                                   ) : (
                                       <span className="text-xs text-gray-500 italic">Brak przypisanych</span>
                                   )}
                                   <button
                                        onClick={(e) => { e.stopPropagation(); onAssignTask(order); }}
                                        className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-150 ease-in-out shadow"
                                        title="Przypisz zadanie"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                    </button>
                               </div>
                           </div>
                            <div>
                               <h4 className="text-sm font-semibold text-gray-700 mb-1">Dodatkowe informacje</h4>
                               <p className="text-sm text-gray-600">Data utworzenia: {order.created}</p>
                               <p className="text-sm text-gray-600">Priorytet: <span className={getPriorityColor(order.priority)}>{order.priority}</span></p>
                               {/* Można dodać więcej pól */}
                           </div>
                       </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
       {filteredOrders.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <Filter className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                Brak zleceń pasujących do filtrów.
            </div>
        )}
    </div>
  );
};

// Order Detail View Component (Komponent Widoku Szczegółowego Zlecenia)
const OrderDetailView = ({ order, onClose, onAssignTask }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in transition duration-300 ease-in-out">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-slide-in-up transition duration-500 ease-out">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition duration-150 ease-in-out"
          title="Zamknij"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-2 ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
             <span className={`ml-2 inline-block px-3 py-1 text-sm font-semibold rounded-full mb-2 border ${getPriorityColor(order.priority).replace('text-', 'border-').replace('-600', '-500')} ${getPriorityColor(order.priority)}`}>
              {order.priority} Priorytet
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">{order.title}</h2>
            <p className="text-lg text-gray-600">Klient: {order.customer}</p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column (Details) */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Opis Zlecenia</h3>
                <p className="text-gray-600 leading-relaxed">{order.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Kluczowe Daty</h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <PlusCircle className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Utworzono: {order.created}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2 text-red-500" />
                  <span>Termin wykonania: {order.deadline}</span>
                </div>
              </div>
               {/* Można dodać więcej sekcji: Pliki, Komentarze, Historia zmian itp. */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Aktywność</h3>
                    {/* Placeholder for activity feed */}
                    <div className="space-y-3 text-sm text-gray-500 italic">
                        <p>Tutaj pojawi się historia zmian i komentarze...</p>
                        {/* Example: */}
                        {/* <p>19/04/2025 10:15 - Anna Kowalska przypisała Piotra Nowaka.</p> */}
                        {/* <p>18/04/2025 14:30 - Zlecenie utworzone.</p> */}
                    </div>
                </div>
            </div>

            {/* Right Column (Assigned Team) */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Przypisany Zespół</h3>
                <div className="space-y-3">
                  {order.assignedTo.length > 0 ? (
                    order.assignedTo.map(empId => {
                      const emp = mockEmployees.find(e => e.id === empId);
                      return emp ? (
                        <div key={empId} className="flex items-center p-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition duration-150 ease-in-out">
                          <EmployeeAvatar employeeId={empId} size="md" />
                          <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-800">{emp.name}</p>
                            <p className="text-xs text-gray-500">{emp.role}</p>
                          </div>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <p className="text-sm text-gray-500 italic">Brak przypisanych pracowników.</p>
                  )}
                </div>
                <button
                  onClick={() => onAssignTask(order)}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Zarządzaj Zespołem
                </button>
              </div>
               {/* Można dodać akcje specyficzne dla zlecenia */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Akcje</h3>
                    <div className="space-y-2">
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out">Edytuj Zlecenie</button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out">Dodaj Komentarz</button>
                         <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition duration-150 ease-in-out">Usuń Zlecenie</button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Assign Task Modal Component (Komponent Modala Przypisywania Zadań)
const AssignTaskModal = ({ order, onClose }) => {
    const [assigned, setAssigned] = useState(order ? [...order.assignedTo] : []);
    const [searchTerm, setSearchTerm] = useState('');

    if (!order) return null;

    const toggleAssignment = (empId) => {
        setAssigned(prev =>
            prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
        );
    };

    const filteredEmployees = mockEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        console.log(`Zapisano przypisania dla zlecenia ${order.id}:`, assigned);
        // Tutaj logika zapisu zmian (np. aktualizacja stanu w komponencie nadrzędnym)
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in transition duration-300 ease-in-out">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-in-up transition duration-500 ease-out">
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Przypisz do zlecenia: <span className="font-bold">{order.title}</span></h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
                        title="Zamknij"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-5 flex-grow overflow-y-auto">
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Szukaj pracownika..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    <div className="space-y-3">
                        {filteredEmployees.map(emp => (
                            <div
                                key={emp.id}
                                onClick={() => toggleAssignment(emp.id)}
                                className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-200 ease-in-out ${assigned.includes(emp.id) ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50 hover:bg-gray-100'}`}
                            >
                                <EmployeeAvatar employeeId={emp.id} size="lg" />
                                <div className="ml-4 flex-grow">
                                    <p className="text-md font-semibold text-gray-900">{emp.name}</p>
                                    <p className="text-sm text-gray-500">{emp.role}</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition duration-200 ease-in-out ${assigned.includes(emp.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'}`}>
                                    {assigned.includes(emp.id) && <CheckCircle className="w-4 h-4 text-white" />}
                                </div>
                            </div>
                        ))}
                         {filteredEmployees.length === 0 && (
                            <p className="text-center text-gray-500 py-4">Nie znaleziono pracowników.</p>
                        )}
                    </div>
                </div>

                <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                        Zapisz zmiany
                    </button>
                </div>
            </div>
        </div>
    );
};


// Charts Component (Komponent Wykresów)
const ChartsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Performance Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Wydajność Tygodniowa</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartDataWeekly} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e5e7eb', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
              itemStyle={{ color: '#374151' }}
              cursor={{ fill: 'rgba(219, 234, 254, 0.4)' }} // Light blue on hover
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="Nowe" fill="#3b82f6" name="Nowe Zlecenia" radius={[4, 4, 0, 0]} barSize={20} isAnimationActive={true} animationDuration={800} />
            <Bar dataKey="Wykonane" fill="#10b981" name="Wykonane Zlecenia" radius={[4, 4, 0, 0]} barSize={20} isAnimationActive={true} animationDuration={800} animationBegin={200} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Trend Miesięczny (Liczba Zleceń)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartDataMonthly} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e5e7eb', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
              itemStyle={{ color: '#374151' }}
              cursor={{ stroke: '#3b82f6', strokeWidth: 1 }} // Blue line cursor
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="Zlecenia"
              stroke="#3b82f6" // Blue line
              strokeWidth={3}
              dot={{ r: 5, fill: '#3b82f6' }} // Blue dots
              activeDot={{ r: 8, stroke: '#eff6ff', strokeWidth: 2, fill: '#2563eb' }} // Larger active dot with halo
              isAnimationActive={true}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


// Main App Component (Główny Komponent Aplikacji)
const App = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState(null);
  const [orders, setOrders] = useState(mockOrders); // Stan dla zleceń

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };

   const handleOpenAssignModal = (order) => {
        setOrderToAssign(order);
        setIsAssignModalOpen(true);
        setSelectedOrder(null); // Zamknij widok szczegółów, jeśli był otwarty
    };

    const handleCloseAssignModal = () => {
        setIsAssignModalOpen(false);
        setOrderToAssign(null);
    };

  // Obliczenia do kart podsumowania
  const summary = useMemo(() => {
      const newOrders = orders.filter(o => o.status === 'Nowe').length;
      const inProgressOrders = orders.filter(o => o.status === 'W trakcie').length;
      const completedOrders = orders.filter(o => o.status === 'Wykonane').length;
      const delayedOrders = orders.filter(o => o.status === 'Opóźnione').length;
      return { newOrders, inProgressOrders, completedOrders, delayedOrders };
  }, [orders]);


  // Efekt do animacji wejścia (można rozbudować)
  useEffect(() => {
    // Prosta animacja dla kart - dodanie klasy po załadowaniu
    const cards = document.querySelectorAll('.summary-card-animate');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('opacity-100', 'translate-y-0');
      }, index * 100); // Opóźnienie dla efektu kaskadowego
    });
  }, []);


  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-blue-50 font-sans antialiased">
      {/* Sidebar */}
      <aside className={`absolute inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-blue-600">
          <span className="text-xl font-bold tracking-tight">Digital Dev</span>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-blue-200 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-800 text-white group">
            <Briefcase className="mr-3 h-5 w-5 text-blue-300" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-600 hover:text-white group">
            <Users className="mr-3 h-5 w-5 text-blue-300 group-hover:text-white" />
            Zlecenia
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-600 hover:text-white group">
            <User className="mr-3 h-5 w-5 text-blue-300 group-hover:text-white" />
            Klienci
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-600 hover:text-white group">
            <Settings className="mr-3 h-5 w-5 text-blue-300 group-hover:text-white" />
            Ustawienia
          </a>
        </nav>
         <div className="p-4 border-t border-blue-600">
             <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-600 hover:text-white group">
                <LogOut className="mr-3 h-5 w-5 text-blue-300 group-hover:text-white" />
                Wyloguj
            </a>
         </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-700">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 flex justify-end items-center space-x-4">
             {/* Placeholder for search or other actions */}
             <div className="relative hidden sm:block">
                <input type="text" placeholder="Szybkie wyszukiwanie..." className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200"/>
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"/>
             </div>
             <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">Anna Kowalska</span>
                <EmployeeAvatar employeeId={1} size="md" />
             </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
             {/* Dodano klasy do animacji wejścia */}
            <div className="summary-card-animate opacity-0 translate-y-5 transition-all duration-500 ease-out">
                <SummaryCard title="Nowe Zlecenia" value={summary.newOrders} icon={PlusCircle} color="border-blue-500" change={2} />
            </div>
            <div className="summary-card-animate opacity-0 translate-y-5 transition-all duration-500 ease-out">
                <SummaryCard title="W Trakcie" value={summary.inProgressOrders} icon={Clock} color="border-yellow-500" change={-5}/>
            </div>
             <div className="summary-card-animate opacity-0 translate-y-5 transition-all duration-500 ease-out">
                <SummaryCard title="Wykonane" value={summary.completedOrders} icon={CheckCircle} color="border-green-500" change={10}/>
            </div>
             <div className="summary-card-animate opacity-0 translate-y-5 transition-all duration-500 ease-out">
                <SummaryCard title="Opóźnione" value={summary.delayedOrders} icon={AlertTriangle} color="border-red-500" change={1}/>
            </div>
          </div>

          {/* Order Table */}
          <div className="mb-6">
            <OrderTable orders={orders} onSelectOrder={handleSelectOrder} onAssignTask={handleOpenAssignModal} />
          </div>

          {/* Charts Section */}
          <div>
            <ChartsSection />
          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailView order={selectedOrder} onClose={handleCloseDetail} onAssignTask={handleOpenAssignModal} />

       {/* Assign Task Modal */}
       {isAssignModalOpen && <AssignTaskModal order={orderToAssign} onClose={handleCloseAssignModal} />}


      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App; // Eksportuj komponent App jako domyślny
