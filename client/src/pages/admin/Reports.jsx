import { FileText, Download, Filter, Calendar, Search } from 'lucide-react';

const Reports = () => {
  const reports = [
    {
      id: 1,
      title: 'Monthly User Activity Report',
      type: 'User Analytics',
      generatedDate: '2024-07-20',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: 2,
      title: 'Institute Performance Report',
      type: 'Institute Analytics',
      generatedDate: '2024-07-19',
      size: '1.8 MB',
      format: 'PDF'
    },
    {
      id: 3,
      title: 'Course Completion Statistics',
      type: 'Course Analytics',
      generatedDate: '2024-07-18',
      size: '3.2 MB',
      format: 'Excel'
    },
    {
      id: 4,
      title: 'Revenue Report Q2 2024',
      type: 'Financial',
      generatedDate: '2024-07-15',
      size: '1.5 MB',
      format: 'PDF'
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'User Analytics':
        return 'bg-blue-100 text-blue-700';
      case 'Institute Analytics':
        return 'bg-purple-100 text-purple-700';
      case 'Course Analytics':
        return 'bg-green-100 text-green-700';
      case 'Financial':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports</h1>
          <p className="text-gray-600">Generate and download platform reports</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <FileText size={18} />
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <FileText className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">{reports.length}</p>
              <p className="text-sm text-gray-500">Total Reports</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">12</p>
              <p className="text-sm text-gray-500">This Month</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Download className="text-purple-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">156</p>
              <p className="text-sm text-gray-500">Downloads</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <FileText className="text-orange-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">8.9 MB</p>
              <p className="text-sm text-gray-500">Total Size</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Generated Reports</h2>
        </div>
        
        <div className="divide-y">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={18} className="text-green-600" />
                      <span>Generated: {report.generatedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText size={18} className="text-green-600" />
                      <span>Format: {report.format}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Download size={18} className="text-green-600" />
                      <span>Size: {report.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
