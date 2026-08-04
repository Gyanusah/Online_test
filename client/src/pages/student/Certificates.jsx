import { Award, Download, Share2, Calendar, CheckCircle } from 'lucide-react';

const Certificates = () => {
  const handleDownload = (certificateId) => {
    alert(`Downloading certificate ${certificateId}. This would trigger a PDF download.`);
  };

  const handleShare = (certificateId) => {
    alert(`Sharing certificate ${certificateId}. This would open sharing options.`);
  };
  const certificates = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      issuer: 'Tech Academy',
      issueDate: '2024-01-15',
      credentialId: 'TA-JS-2024-001',
      status: 'Verified',
      description: 'Comprehensive understanding of JavaScript core concepts, ES6+ features, and asynchronous programming.'
    },
    {
      id: 2,
      title: 'React Development',
      issuer: 'Web Dev Institute',
      issueDate: '2024-02-20',
      credentialId: 'WDI-REACT-2024-045',
      status: 'Verified',
      description: 'Advanced React skills including hooks, state management, and component architecture.'
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      issuer: 'CS Mastery',
      issueDate: '2024-03-10',
      credentialId: 'CSM-DSA-2024-089',
      status: 'Verified',
      description: 'Mastery of fundamental data structures and algorithmic problem-solving techniques.'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Certificates</h1>
        <p className="text-gray-600">View and download your earned certificates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Award className="text-blue-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">{certificates.length}</p>
              <p className="text-sm text-gray-500">Total Certificates</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {certificates.filter(c => c.status === 'Verified').length}
              </p>
              <p className="text-sm text-gray-500">Verified</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3">
            <Calendar className="text-purple-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-800">2024</p>
              <p className="text-sm text-gray-500">Latest Year</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Award size={32} />
                <div>
                  <h3 className="font-bold text-lg">{certificate.title}</h3>
                  <p className="text-sm opacity-90">{certificate.issuer}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">{certificate.status}</span>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {certificate.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>Issued: {certificate.issueDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award size={14} />
                  <span>ID: {certificate.credentialId}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownload(certificate.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Download size={16} />
                  Download
                </button>
                <button 
                  onClick={() => handleShare(certificate.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificates;
