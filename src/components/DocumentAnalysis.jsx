import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analysisService } from "../services/api";
import SuccessModal from "./SuccessModal";

const DocumentAnalysis = () => {
  const [files, setFiles] = useState({
    student: null,
    curriculum: null,
    optional: null,
  });
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    currentCourse: "",
    targetCourse: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [successModal, setSuccessModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (successModal) {
      const timer = setTimeout(() => {
        setSuccessModal(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [successModal]);

  const handleFileChange = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Envia documentos para análise no backend
   */
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);
    setAnalysisResults(null);

    try {
      // Criar FormData para enviar arquivos
      const formDataToSend = new FormData();

      // Adicionar arquivos
      if (files.student) {
        formDataToSend.append("pdf_aluno", files.student);
      }
      if (files.curriculum) {
        formDataToSend.append("pdf_opcionais", files.curriculum);
      }
      if (files.optional) {
        formDataToSend.append("pdf_certificacoes", files.optional);
      }

      // Adicionar dados do formulário
      formDataToSend.append("studentName", formData.studentName);
      formDataToSend.append("registration", formData.studentId);
      formDataToSend.append("currentCourse", formData.currentCourse);
      formDataToSend.append("targetCourse", formData.targetCourse);

      // Enviar para o backend
      const response = await analysisService.submitAnalysis(formDataToSend);

      // Salvar o ID da análise
      const id = response.id || response.analysis_id;
      setAnalysisId(id);

      // Simular progresso enquanto aguarda resposta
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (progress <= 99) {
          setAnalysisProgress(progress);
        }

        if (progress === 100) {
          clearInterval(progressInterval);
          setSuccessModal(true);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }, 500);
    } catch (err) {
      console.error("Erro ao enviar análise:", err);
      setIsAnalyzing(false);
      setError(err.message || "Erro ao enviar documentos para análise");
    }
  };

  const canAnalyze =
    files.student &&
    files.curriculum &&
    formData.currentCourse &&
    formData.studentId &&
    formData.studentName &&
    formData.targetCourse;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-medium text-gray-900">
          Análise de Documentos
        </h2>
        <p className="text-sm text-gray-500">
          Envie documentos para análise de equivalência curricular
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Histórico Escolar */}
          <div className="file-drop-area border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <i className="fas fa-file-pdf text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Histórico Escolar
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Arraste e solte ou clique para selecionar
            </p>
            <label
              htmlFor="student-pdf"
              className="cursor-pointer gradient-bg text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition duration-300 inline-flex items-center"
            >
              <i className="fas fa-folder-open mr-2"></i>
              <span>Selecionar Arquivo</span>
              <input
                id="student-pdf"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange("student", e)}
              />
            </label>
            {files.student && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">
                  Arquivo selecionado:
                </p>
                <p className="text-sm text-gray-500">{files.student.name}</p>
              </div>
            )}
          </div>

          {/* Grade Curricular */}
          <div className="file-drop-area border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <i className="fas fa-file-pdf text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Grade Curricular
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Arraste e solte ou clique para selecionar
            </p>
            <label
              htmlFor="curriculum-pdf"
              className="cursor-pointer gradient-bg text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition duration-300 inline-flex items-center"
            >
              <i className="fas fa-folder-open mr-2"></i>
              <span>Selecionar Arquivo</span>
              <input
                id="curriculum-pdf"
                type="file"
                className="hidden"
                accept=".pdf,.xml,.json"
                onChange={(e) => handleFileChange("curriculum", e)}
              />
            </label>
            {files.curriculum && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">
                  Arquivo selecionado:
                </p>
                <p className="text-sm text-gray-500">{files.curriculum.name}</p>
              </div>
            )}
          </div>

          {/* Documentos Adicionais */}
          <div className="file-drop-area border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <i className="fas fa-file-pdf text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Documentos Adicionais
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Certificados, declarações, etc.
            </p>
            <label
              htmlFor="optional-pdf"
              className="cursor-pointer gradient-bg text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition duration-300 inline-flex items-center"
            >
              <i className="fas fa-folder-open mr-2"></i>
              <span>Selecionar Arquivo</span>
              <input
                id="optional-pdf"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange("optional", e)}
              />
            </label>
            {files.optional && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">
                  Arquivo selecionado:
                </p>
                <p className="text-sm text-gray-500">{files.optional.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Informações Adicionais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                id="student-name"
                placeholder=" "
                value={formData.studentName}
                onChange={(e) =>
                  handleInputChange("studentName", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label
                htmlFor="student-name"
                className="floating-label left-3 text-gray-500 pointer-events-none"
              >
                Nome do Aluno
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="student-id"
                placeholder=" "
                value={formData.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label
                htmlFor="student-id"
                className="floating-label left-3 text-gray-500 pointer-events-none"
              >
                Matrícula
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="current-course"
                placeholder=" "
                value={formData.currentCourse}
                onChange={(e) =>
                  handleInputChange("currentCourse", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label
                htmlFor="current-course"
                className="floating-label left-3 text-gray-500 pointer-events-none"
              >
                Curso Atual
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="target-course"
                placeholder=" "
                value={formData.targetCourse}
                onChange={(e) =>
                  handleInputChange("targetCourse", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label
                htmlFor="target-course"
                className="floating-label left-3 text-gray-500 pointer-events-none"
              >
                Curso Destino
              </label>
            </div>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-circle text-red-500"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Botão de Análise */}
        <div className="mt-6 text-center">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            className="gradient-bg text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Analisando...
              </>
            ) : (
              <>
                <i className="fas fa-search mr-2"></i> Analisar Documentos
              </>
            )}
          </button>
        </div>

        {/* Progresso da Análise */}
        {isAnalyzing && (
          <div className="mt-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Análise em andamento
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {analysisProgress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${analysisProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <SuccessModal
        open={successModal}
        message="Análise feita com sucesso!"
        onClose={() => setSuccessModal(false)}
      />
    </div>
  );
};

export default DocumentAnalysis;
