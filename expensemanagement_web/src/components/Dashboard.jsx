import React, { useState, useEffect } from 'react';

// --- Font Loader ---
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap";
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  return null;
};

// --- Color Palette ---
const colors = {
    deepNavy: '#001B48',
    darkBlue: '#02457A',
    brightBlue: '#018ABE',
    softLightBlue: '#97CADB',
    paleBlue: '#D6E8EE',
    white: '#FFFFFF',
    background: '#F7F9FC',
    successGreen: '#3BBF5C',
    warningOrange: '#FF9F3B',
    errorRed: '#F44336',
    lightGreen: '#C7F7C7',
    lightOrange: '#FFE9C7',
    lightRed: '#FFCDD2',
    textMuted: '#6B7280',
};

// --- Helper & Icon Components ---
const Icon = ({ path, className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const TrendIndicator = ({ value, type }) => {
    const isPositive = type === 'positive';
    return (
        <div className={`flex items-center text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            <Icon path={isPositive ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} className="h-4 w-4 mr-1" />
            <span>{value}</span>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend, currency = '$' }) => (
  <div style={{ backgroundColor: colors.white, color: colors.deepNavy }} className="p-5 rounded-xl flex items-center shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div style={{ backgroundColor: colors.paleBlue }} className="p-3 mr-4 rounded-full">
      {icon}
    </div>
    <div className="flex-grow">
      <p className="text-sm font-medium" style={{color: colors.darkBlue, fontFamily: "'Inter', sans-serif"}}>{title}</p>
      <p className="text-2xl font-bold" style={{fontFamily: "'Poppins', sans-serif"}}>{currency}{value}</p>
    </div>
    {trend && <TrendIndicator value={trend.value} type={trend.type} />}
  </div>
);


// --- Advanced Static Chart Components ---
const AnimatedDonutChart = ({ data, chartColors, currency = '$' }) => {
    const [animatedData, setAnimatedData] = useState([]);
    useEffect(() => {
        const timeoutId = setTimeout(() => setAnimatedData(data), 100);
        return () => clearTimeout(timeoutId);
    }, [data]);
    const radius = 80;
    const strokeWidth = 25;
    const innerRadius = radius - strokeWidth;
    const circumference = 2 * Math.PI * innerRadius;
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    let accumulatedAngle = 0;
    return (
        <div className="flex items-center justify-center p-4 h-[300px]">
            <div className="relative">
                <svg width="200" height="200" viewBox="0 0 160 160">
                    {animatedData.map((item, index) => {
                        const percentage = totalValue > 0 ? item.value / totalValue : 0;
                        const dashOffset = circumference * (1 - percentage);
                        const rotation = accumulatedAngle;
                        accumulatedAngle += percentage * 360;
                        return (
                            <circle key={index} r={innerRadius} cx={radius} cy={radius} fill="transparent" stroke={chartColors[index % chartColors.length]} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={dashOffset} transform={`rotate(${rotation - 90} ${radius} ${radius})`} style={{transition: 'stroke-dashoffset 1s ease-out'}} />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs" style={{color: colors.textMuted}}>Total</span>
                    <span className="font-bold text-xl" style={{fontFamily: "'Poppins', sans-serif", color: colors.deepNavy}}>{currency}{!isNaN(totalValue) ? totalValue.toFixed(2) : '0.00'}</span>
                </div>
            </div>
             <div className="ml-12 text-sm w-40" style={{fontFamily: "'Inter', sans-serif"}}>
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <div style={{ backgroundColor: chartColors[index % chartColors.length] }} className="w-3 h-3 rounded-full mr-3"></div>
                        <span style={{color: colors.deepNavy}}>{entry.name}</span>
                        <span className="ml-auto font-medium" style={{color: colors.textMuted}}>{currency}{entry.value.toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AnimatedLineChart = ({ data, chartColor, currency = '$' }) => {
    const pathRef = React.useRef(null);
    const width = 500;
    const height = 250;
    const padding = 40;

    const maxValue = Math.max(...data.map(p => p.value), 0);
    const xStep = (width - padding * 2) / (data.length > 1 ? data.length - 1 : 1);

    const points = data.map((point, i) => {
        const x = padding + i * xStep;
        const y = height - padding - (point.value / (maxValue || 1)) * (height - padding * 2);
        return `${x},${y}`;
    }).join(' ');
    
    useEffect(() => {
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            pathRef.current.style.transition = 'none';
            pathRef.current.style.strokeDashoffset = length;
            pathRef.current.getBoundingClientRect();
            pathRef.current.style.transition = 'stroke-dashoffset 2s ease-out';
            pathRef.current.style.strokeDashoffset = '0';
        }
    }, [points]);

    return (
        <div className="h-[300px] w-full p-4">
            <svg viewBox={`0 0 ${width} ${height}`}>
                {[0, 0.25, 0.5, 0.75, 1].map(tick => (
                     <g key={tick}>
                        <line x1={padding} y1={height - padding - tick * (height - padding * 2)} x2={width - padding} y2={height - padding - tick * (height - padding * 2)} stroke={colors.paleBlue} strokeWidth="1" />
                        <text x={padding - 10} y={height - padding - tick * (height - padding * 2) + 5} textAnchor="end" fontSize="10" fill={colors.textMuted}>
                           {currency}{(tick * (maxValue || 0)).toFixed(0)}
                        </text>
                     </g>
                ))}
                {data.map((point, i) => (
                    <text key={i} x={padding + i * xStep} y={height - padding + 20} textAnchor="middle" fontSize="10" fill={colors.textMuted}>
                        {point.label}
                    </text>
                ))}
                
                <polyline ref={pathRef} fill="none" stroke={chartColor} strokeWidth="2" points={points}
                  strokeDasharray={pathRef.current ? pathRef.current.getTotalLength() : 0}
                />
            </svg>
        </div>
    );
};


// --- Modal Component for Adding Users ---
const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Employee');
    if (!isOpen) return null;
    const handleSubmit = (e) => {
        e.preventDefault(); onAddUser({ name, email, role, id: Date.now() }); onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center font-inter">
            <div style={{ backgroundColor: colors.white, color: colors.deepNavy }} className="p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 font-poppins">Add New User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} style={{backgroundColor: colors.white, borderColor: colors.softLightBlue}} className="w-full text-gray-800 rounded-md p-2 border focus:border-brightBlue focus:ring-2 focus:ring-softLightBlue focus:outline-none transition select-auto" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{backgroundColor: colors.white, borderColor: colors.softLightBlue}} className="w-full text-gray-800 rounded-md p-2 border focus:border-brightBlue focus:ring-2 focus:ring-softLightBlue focus:outline-none transition select-auto" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value)} style={{backgroundColor: colors.white, borderColor: colors.softLightBlue}} className="w-full text-gray-800 rounded-md p-2 border focus:border-brightBlue focus:ring-2 focus:ring-softLightBlue focus:outline-none transition select-auto">
                            <option>Employee</option>
                            <option>Manager</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} style={{backgroundColor: colors.white, color: colors.brightBlue, borderColor: colors.brightBlue}} className="font-bold py-2 px-4 rounded-lg border hover:bg-paleBlue transition">Cancel</button>
                        <button type="submit" style={{backgroundColor: colors.brightBlue, color: colors.white}} className="font-bold py-2 px-4 rounded-lg hover:opacity-90 transition">Add User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Add Expense Page Component ---
const FormInput = ({ label, id, type, value, onChange, placeholder, icon }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium mb-1 font-inter" style={{ color: colors.darkBlue }}>{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{ backgroundColor: colors.white, borderColor: colors.softLightBlue }}
                className="w-full text-gray-800 rounded-md p-2 pl-10 border focus:border-brightBlue focus:ring-2 focus:ring-softLightBlue focus:outline-none transition select-auto"
                required={type !== 'text' || id !== 'customCategory'} // Custom category is not required if not visible
            />
        </div>
    </div>
);

const AddExpense = ({ onBack, currency, categories, setCategories }) => {
    const [merchant, setMerchant] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [customCategory, setCustomCategory] = useState('');
    const [description, setDescription] = useState('');
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalCategory = category === 'Other' ? customCategory.trim() : category;

        if (category === 'Other' && finalCategory === '') {
            alert('Please provide a name for your custom category.');
            return;
        }

        if (category === 'Other' && finalCategory !== '' && !categories.includes(finalCategory)) {
            const newCategories = [...categories.slice(0, -1), finalCategory, 'Other'];
            setCategories(newCategories);
        }

        console.log({ merchant, date, amount, category: finalCategory, description, receipt: fileName });
        alert('Expense submitted successfully!');
        onBack();
    };

    return (
        <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold font-poppins">Submit an Expense</h2>
                    <p style={{color: colors.textMuted}}>Fill out the details below to create a new expense report.</p>
                </div>
                <button onClick={onBack} style={{ backgroundColor: colors.white, color: colors.darkBlue, borderColor: colors.paleBlue }} className="font-bold py-2 px-5 rounded-lg transition duration-300 flex items-center shadow-sm border hover:shadow-md hover:-translate-y-0.5">
                    <Icon path="M10 19l-7-7m0 0l7-7m-7 7h18" className="h-5 w-5 mr-2" /> Back to Dashboard
                </button>
            </div>

            <div style={{backgroundColor: colors.white}} className="rounded-xl shadow-md overflow-hidden">
                <h3 style={{backgroundColor: colors.darkBlue, color: colors.white}} className="text-lg font-poppins font-semibold p-4">Expense Details</h3>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput 
                            label="Merchant / Vendor"
                            id="merchant"
                            type="text"
                            value={merchant}
                            onChange={(e) => setMerchant(e.target.value)}
                            placeholder="e.g., Uber, Starbucks"
                            icon={<Icon path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h5m-5 4h5m-5-4a1 1 0 01-1-1V7a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1m-5 0a1 1 0 00-1 1v2a1 1 0 001 1h5a1 1 0 001-1v-2a1 1 0 00-1-1m-5-4h.01" className="h-5 w-5 text-gray-400" />}
                        />

                        <FormInput
                            label="Date of Expense"
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            icon={<Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" className="h-5 w-5 text-gray-400" />}
                        />

                        <FormInput
                            label={`Amount (${currency})`}
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            icon={<span className="text-gray-400 text-lg font-medium">{currency}</span>}
                        />
                        
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium mb-1 font-inter" style={{ color: colors.darkBlue }}>Category</label>
                            <div className="relative">
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" className="h-5 w-5 text-gray-400" />
                                 </div>
                                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} style={{backgroundColor: colors.white, borderColor: colors.softLightBlue}} className="w-full text-gray-800 rounded-md p-2 pl-10 border focus:border-brightBlue focus:ring-2 focus:ring-softLightBlue focus:outline-none transition select-auto">
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        {category === 'Other' && (
                             <FormInput
                                label="Custom Category Name"
                                id="customCategory"
                                type="text"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                placeholder="e.g., Team Building"
                                icon={<Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="h-5 w-5 text-gray-400" />}
                            />
                        )}

                        <div className="md:col-span-2">
                             <label htmlFor="description" className="block text-sm font-medium mb-1 font-inter" style={{ color: colors.darkBlue }}>Description</label>
                             <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" placeholder="A brief description of the expense..." style={{backgroundColor: colors.white, borderColor: colors.softLightBlue}} className="w-full text-gray-800 rounded-md p-2 border focus:border-brightBlue focus:ring-2 focus:ring-softLightBlue focus:outline-none transition select-auto"></textarea>
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 font-inter" style={{ color: colors.darkBlue }}>Attach Receipt</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md" style={{borderColor: colors.softLightBlue}}>
                                <div className="space-y-1 text-center">
                                    <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" className="mx-auto h-12 w-12 text-gray-400"/>
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brightBlue hover:text-darkBlue focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brightBlue">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">{fileName || 'PNG, JPG, PDF up to 10MB'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="flex justify-end gap-4 pt-6 mt-6 border-t" style={{borderColor: colors.paleBlue}}>
                        <button type="button" onClick={onBack} style={{backgroundColor: colors.white, color: colors.brightBlue, borderColor: colors.brightBlue}} className="font-bold py-2 px-6 rounded-lg border hover:bg-paleBlue transition">Cancel</button>
                        <button type="submit" style={{backgroundColor: colors.successGreen, color: colors.white}} className="font-bold py-2 px-6 rounded-lg hover:opacity-90 transition flex items-center">
                            <Icon path="M5 13l4 4L19 7" className="h-5 w-5 mr-2" /> Submit Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- View Components ---
const EmployeeView = ({ onNavigate, currency }) => {
  const [expenses, setExpenses] = useState([ { id: 1, date: '2025-10-03', category: 'Travel', merchant: 'Uber', amount: 45.50, status: 'Approved' }, { id: 2, date: '2025-10-02', category: 'Meals', merchant: 'Starbucks', amount: 12.80, status: 'Approved' }, { id: 3, date: '2025-10-01', category: 'Software', merchant: 'Adobe', amount: 59.99, status: 'Pending' }, { id: 4, date: '2025-09-28', category: 'Office Supplies', merchant: 'Amazon', amount: 127.00, status: 'Rejected' }, { id: 5, date: '2025-09-25', category: 'Travel', merchant: 'Delta Airlines', amount: 350.00, status: 'Approved' }, ]); const getStatusStyle = (status) => { switch (status) { case 'Approved': return { color: colors.successGreen, backgroundColor: colors.lightGreen }; case 'Pending': return { color: colors.warningOrange, backgroundColor: colors.lightOrange }; case 'Rejected': return { color: colors.errorRed, backgroundColor: colors.lightRed }; default: return {}; } }; const chartData = expenses.reduce((acc, expense) => { const existingCategory = acc.find(item => item.name === expense.category); if (existingCategory) existingCategory.value += expense.amount; else acc.push({ name: expense.category, value: expense.amount }); return acc; }, []); const chartColors = [colors.darkBlue, colors.brightBlue, colors.softLightBlue, '#00C49F'];
  return (
    <>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold font-poppins">My Expenses</h2>
            <button onClick={() => onNavigate('addExpense')} style={{ backgroundColor: colors.brightBlue, color: colors.white }} className="font-bold py-2 px-5 rounded-lg transition duration-300 shadow hover:shadow-lg hover:-translate-y-0.5"> Submit New Expense </button>
        </div>
        <div style={{backgroundColor: colors.white}} className="p-4 rounded-xl mb-6 shadow-md">
            <h3 style={{backgroundColor: colors.darkBlue, color: colors.white}} className="text-lg font-poppins font-semibold p-3 rounded-t-lg -m-4 mb-4">Spending by Category</h3>
            <AnimatedDonutChart data={chartData} chartColors={chartColors} currency={currency}/>
        </div>
        <div style={{backgroundColor: colors.white}} className="rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full">
                <thead style={{backgroundColor: colors.darkBlue, color: colors.white}}>
                    <tr> {['Date', 'Category', 'Merchant', 'Amount', 'Status'].map(head => <th key={head} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-poppins">{head}</th>)} </tr>
                </thead>
                <tbody className="divide-y" style={{borderColor: colors.paleBlue}}>
                    {expenses.map(expense => (
                        <tr key={expense.id} className="hover:bg-paleBlue transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{expense.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{expense.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{expense.merchant}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{currency}{expense.amount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap"> <span style={getStatusStyle(expense.status)} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}>{expense.status}</span> </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
  );
};

const ManagerView = ({ currency, onNavigate }) => {
    const [approvals] = useState([ { id: 1, employee: 'Alice Johnson', report: 'Q3 Client Visit', date: '2025-10-01', amount: 543.12, status: 'Pending' }, { id: 2, employee: 'Bob Williams', report: 'Marketing Conference', date: '2025-09-30', amount: 1250.75, status: 'Pending' }, { id: 3, employee: 'Charlie Brown', report: 'Software Subscriptions', date: '2025-09-29', amount: 210.50, status: 'Pending' }, { id: 4, employee: 'Alice Johnson', report: 'Team Lunch', date: '2025-09-28', amount: 88.00, status: 'Pending' }, ]); const [animateBars, setAnimateBars] = useState(false); useEffect(() => { const timer = setTimeout(() => setAnimateBars(true), 100); return () => clearTimeout(timer); }, []);
    return (
    <>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold font-poppins">Approvals Overview</h2>
            <button onClick={() => onNavigate('addExpense')} style={{ backgroundColor: colors.brightBlue, color: colors.white }} className="font-bold py-2 px-5 rounded-lg transition duration-300 shadow hover:shadow-lg hover:-translate-y-0.5"> Submit New Expense </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard title="Pending Reports" value="4" icon={<Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />} trend={{value: '+2', type: 'negative'}} currency=""/>
            <StatCard title="Approved This Month" value="14" icon={<Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />} trend={{value: '-5%', type: 'negative'}} currency=""/>
            <StatCard title="Total Pending Amount" value="2,092.37" icon={<Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />} trend={{value: '+12%', type: 'positive'}} currency={currency}/>
        </div>
        <div style={{backgroundColor: colors.white}} className="p-4 rounded-xl mb-6 shadow-md">
             <h3 style={{backgroundColor: colors.darkBlue, color: colors.white}} className="text-lg font-poppins font-semibold p-3 rounded-t-lg -m-4 mb-4">Pending Amount by Employee</h3>
            <div className="w-full h-[300px] px-4 pt-4 flex items-end justify-around rounded">
                {[ {name: 'Alice J.', height: '50%'}, {name: 'Bob W.', height: '100%'}, {name: 'Charlie B.', height: '17%'} ].map(emp => (
                    <div key={emp.name} className="text-center w-1/3">
                        <div style={{ height: emp.height, backgroundColor: colors.brightBlue, transform: animateBars ? 'scaleY(1)' : 'scaleY(0)', transformOrigin: 'bottom', transition: 'transform 0.5s ease-out' }} className="w-12 mx-auto rounded-t-md"></div>
                        <p className="text-xs mt-2">{emp.name}</p>
                    </div>
                ))}
            </div>
        </div>
        <div style={{backgroundColor: colors.white}} className="rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full">
                <thead style={{backgroundColor: colors.darkBlue, color: colors.white}}>
                    <tr> {['Employee', 'Report Title', 'Date Submitted', 'Total Amount', 'Actions'].map(head => <th key={head} className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider font-poppins ${head === 'Actions' ? 'text-center' : 'text-left'}`}>{head}</th>)} </tr>
                </thead>
                <tbody className="divide-y" style={{borderColor: colors.paleBlue}}>
                    {approvals.map(item => (
                        <tr key={item.id} className="hover:bg-paleBlue transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.employee}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{item.report}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{item.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{currency}{item.amount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center"><button style={{color: colors.brightBlue}} className="hover:underline">View</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
  );
};

const AdminView = ({ users, setUsers, currency, onNavigate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleAddUser = (newUser) => setUsers([...users, newUser]);
    
    const companySpendingData = [
        { label: 'May', value: 12000 }, { label: 'Jun', value: 15000 },
        { label: 'Jul', value: 13500 }, { label: 'Aug', value: 17000 },
        { label: 'Sep', value: 18500 }, { label: 'Oct', value: 21000 },
    ];
    
    const roleDistributionData = [
        { name: 'Employees', value: users.filter(u => u.role === 'Employee').length },
        { name: 'Managers', value: users.filter(u => u.role === 'Manager').length },
    ];
    
    const chartColors = [colors.darkBlue, colors.brightBlue];

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold font-poppins">Admin Overview</h2>
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate('addExpense')} style={{ backgroundColor: colors.brightBlue, color: colors.white }} className="font-bold py-2 px-5 rounded-lg transition duration-300 shadow hover:shadow-lg hover:-translate-y-0.5"> Submit New Expense </button>
                    <button onClick={() => setIsModalOpen(true)} style={{backgroundColor: colors.brightBlue, color: colors.white}} className="font-bold py-2 px-5 rounded-lg transition duration-300 flex items-center shadow hover:shadow-lg hover:-translate-y-0.5">
                        <Icon path="M12 4v16m8-8H4" className="h-5 w-5 mr-2" /> Add User
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 p-4 rounded-xl shadow-md" style={{backgroundColor: colors.white}}>
                     <h3 style={{backgroundColor: colors.darkBlue, color: colors.white}} className="text-lg font-poppins font-semibold p-3 rounded-t-lg -m-4 mb-4">Company Spending (Last 6 Months)</h3>
                     <AnimatedLineChart data={companySpendingData} chartColor={colors.brightBlue} currency={currency}/>
                </div>
                <div style={{backgroundColor: colors.white}} className="p-4 rounded-xl shadow-md">
                     <h3 style={{backgroundColor: colors.darkBlue, color: colors.white}} className="text-lg font-poppins font-semibold p-3 rounded-t-lg -m-4 mb-4">User Role Distribution</h3>
                     <AnimatedDonutChart data={roleDistributionData} chartColors={chartColors} currency=""/>
                </div>
            </div>

            <div style={{backgroundColor: colors.white}} className="rounded-xl shadow-md overflow-x-auto">
                 <table className="min-w-full">
                    <thead style={{backgroundColor: colors.darkBlue, color: colors.white}}>
                        <tr>{['Name', 'Email', 'Role'].map(head => <th key={head} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-poppins">{head}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y" style={{borderColor: colors.paleBlue}}>
                        {users.map(user => (
                             <tr key={user.id} className="hover:bg-paleBlue transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddUser={handleAddUser} />
        </>
    );
}

const WelcomeBanner = ({userName}) => (
    <div style={{background: `linear-gradient(135deg, ${colors.brightBlue} 0%, ${colors.darkBlue} 100%)`, color: colors.white}} className="p-6 rounded-xl mb-6 shadow-md flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold font-poppins">Welcome back, {userName}!</h2>
            <p className="font-inter" style={{color: colors.softLightBlue}}>Here's your financial overview for today.</p>
        </div>
        <button style={{backgroundColor: colors.white, color: colors.darkBlue}} className="font-bold py-2 px-5 rounded-lg transition duration-300 hover:bg-paleBlue">View Reports</button>
    </div>
);

const Sidebar = ({ onToggleRole, role, currentUser, onNavigate, currentPage }) => {
    const navItems = [
        {name: 'Dashboard', icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", page: 'dashboard'},
        {name: 'Expenses', icon: "M9 17v-2a4 4 0 00-4-4H3V9a4 4 0 014-4h6a4 4 0 014 4v2", page: 'addExpense'},
        {name: 'Reports', icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", page: 'reports'},
        {name: 'Settings', icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", page: 'settings'}
    ];
    
    const handleLogout = () => {
        // In a real app, this would clear tokens, etc.
        alert('Logged out!');
    }

    return (
        <div style={{background: `linear-gradient(180deg, ${colors.deepNavy} 0%, ${colors.darkBlue} 100%)`}} className="w-64 p-6 flex flex-col text-white shadow-2xl">
             <h1 className="text-2xl font-bold font-poppins text-white mb-12">Expense<span style={{color: colors.brightBlue}}>Flow</span></h1>
             <nav className="flex-grow flex flex-col space-y-2 font-medium">
                {navItems.map(item => {
                    const isActive = currentPage === item.page;
                    return (
                        <a href="#" key={item.name} onClick={(e) => {e.preventDefault(); onNavigate(item.page)}} 
                           className={`flex items-center p-3 rounded-lg transition-colors relative ${isActive ? 'text-white' : 'text-paleBlue hover:bg-darkBlue hover:text-white'}`}
                           style={{backgroundColor: isActive ? colors.darkBlue : 'transparent'}}>
                            {isActive && <div className="absolute left-0 top-0 h-full w-1 rounded-r-full" style={{backgroundColor: colors.brightBlue}}></div>}
                            <Icon path={item.icon} className="h-5 w-5 mr-3"/> {item.name}
                        </a>
                    );
                })}
             </nav>
             <div className="border-t border-gray-700 pt-4">
                <button onClick={onToggleRole} className="w-full font-bold py-2 px-3 rounded-lg text-sm transition duration-300 text-white hover:bg-darkBlue text-left">
                    Switch View (Current: <span className="capitalize">{role}</span>)
                </button>
                 <div className="flex items-center mt-4 p-2 rounded-lg transition-colors hover:bg-darkBlue">
                     <div className="w-10 h-10 rounded-full bg-darkBlue flex items-center justify-center" style={{backgroundColor: colors.brightBlue}}>
                        <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="h-6 w-6 text-white"/>
                     </div>
                     <div className="ml-3">
                        <p className="font-semibold text-sm">{currentUser.name}</p>
                        <p className="text-xs capitalize" style={{color: colors.softLightBlue}}>{currentUser.role}</p>
                     </div>
                 </div>
                 <button onClick={handleLogout} className="w-full flex items-center mt-4 py-2 px-3 rounded-lg text-sm transition duration-300 text-paleBlue hover:bg-red-500 hover:text-white">
                    <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="h-5 w-5 mr-3"/> Logout
                </button>
             </div>
        </div>
    );
};


// --- Main Dashboard Component ---
const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState({ name: 'Admin User', role: 'admin', currency: '₹' });
  const [users, setUsers] = useState([
      { id: 1, name: 'John Doe', email: 'john.d@example.com', role: 'Employee' },
      { id: 2, name: 'Jane Smith', email: 'jane.s@example.com', role: 'Manager' },
      { id: 3, name: 'Peter Jones', email: 'peter.j@example.com', role: 'Employee' },
  ]);
  const [animationKey, setAnimationKey] = useState(0);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [categories, setCategories] = useState(['Travel', 'Meals', 'Software', 'Office Supplies', 'Other']);


  const handleNavigation = (page) => {
      if (page === 'dashboard' || page === 'addExpense') {
          setCurrentPage(page);
          setAnimationKey(prevKey => prevKey + 1);
      } else {
          alert(`Navigation to "${page}" is not implemented yet.`);
      }
  }

  const toggleRole = () => {
      const roles = ['employee', 'manager', 'admin'];
      const currencies = ['$', '€', '₹'];
      const currentRoleIndex = roles.indexOf(currentUser.role);
      const nextRole = roles[(currentRoleIndex + 1) % roles.length];
      
      let name = 'Admin User';
      if(nextRole === 'employee') name = 'John Doe';
      if(nextRole === 'manager') name = 'Jane Smith';
      
      setCurrentUser({ name, role: nextRole, currency: currencies[(currentRoleIndex + 1) % currencies.length] });
      setAnimationKey(prevKey => prevKey + 1);
  };
  
  const renderDashboardContent = () => {
    switch(currentUser.role) {
        case 'employee': return <EmployeeView onNavigate={handleNavigation} currency={currentUser.currency} />;
        case 'manager': return <ManagerView currency={currentUser.currency} onNavigate={handleNavigation} />;
        case 'admin': return <AdminView users={users} setUsers={setUsers} currency={currentUser.currency} onNavigate={handleNavigation}/>;
        default: return null;
    }
  };

  const renderCurrentPage = () => {
      switch(currentPage) {
          case 'addExpense':
              return <AddExpense onBack={() => handleNavigation('dashboard')} currency={currentUser.currency} categories={categories} setCategories={setCategories} />;
          case 'dashboard':
          default:
              return (
                  <>
                    <WelcomeBanner userName={currentUser.name.split(' ')[0]} />
                    {renderDashboardContent()}
                  </>
              );
      }
  }

  return (
    <>
        <FontLoader />
        <div style={{backgroundColor: colors.background, color: colors.deepNavy}} className="h-screen font-inter flex select-none overflow-hidden">
            <Sidebar onToggleRole={toggleRole} role={currentUser.role} currentUser={currentUser} onNavigate={handleNavigation} currentPage={currentPage}/>
            <div className="flex-1 flex flex-col">
                <header className="p-6 flex justify-between items-center shrink-0 border-b" style={{borderColor: colors.paleBlue}}>
                    <div className="relative w-full max-w-xs">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className={`h-5 w-5 text-gray-400`} />
                        </div>
                        <input type="text" placeholder="Search reports, expenses..." style={{backgroundColor: colors.white, borderColor: colors.paleBlue}} className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-brightBlue transition select-auto"/>
                    </div>
                     <div className="flex items-center">
                        <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" className={`h-6 w-6 text-gray-500`} />
                    </div>
                </header>
                <main className="p-6 flex-1 overflow-y-auto">
                    <div key={animationKey} className="animate-fade-in">
                        {renderCurrentPage()}
                    </div>
                </main>
            </div>
        </div>
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
    </>
  );
}

export default Dashboard;

