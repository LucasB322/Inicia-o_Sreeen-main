import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../services/api";
import SuccessModal from "./SuccessModal";

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        const savedAnalyses =
          await apiServices.analysisService.getAnalysisHistory();
        setAnalyses(savedAnalyses.reports);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyses();
  }, []);

  useEffect(() => {
    if (successModal) {
      const timer = setTimeout(() => {
        setSuccessModal(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [successModal]);

  const handleNewAnalysis = () => {
    const savedAnalyses =
      JSON.parse(localStorage.getItem("analysesHistory")) || [];
    setAnalyses(savedAnalyses);
  };

  // 🔥 Função de deletar análise
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar esta análise?")) return;

    try {
      await apiServices.analysisService.deleteAnalysis(id);
      setSuccessModal(true);

      // Remover da lista sem reload
      setAnalyses((prev) => prev.filter((analysis) => analysis.id !== id));
    } catch (error) {
      console.error("Erro ao deletar análise:", error);
      alert("Erro ao deletar análise.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Histórico de Análises
          </h2>
        </div>
      </div>

      <div className="p-6">
        {/* 🔥 LOADING */}
        {loading && (
          <div className="text-center py-12 animate-pulse">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-500">Carregando histórico...</p>
          </div>
        )}

        {/* 🔥 Conteúdo quando NÃO está carregando */}
        {!loading &&
          (analyses.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-history text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Nenhuma análise realizada ainda</p>
              <p className="text-sm text-gray-400 mt-2">
                Realize uma análise de documentos para ver o histórico aqui
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.map((analysis, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/analysis/results/${analysis.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <i className="fas fa-file-alt text-blue-600"></i>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {analysis.studentName || `Análise ${index + 1}`}
                      </p>

                      <p className="text-xs text-gray-500">
                        {analysis.currentCourse && analysis.targetCourse
                          ? `${analysis.currentCourse} → ${analysis.targetCourse}`
                          : "Análise de Equivalência Curricular"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        <i className="fas fa-calendar-alt mr-1"></i>
                        {formatDate(analysis.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* 🔥 Botão de deletar */}
                  <button
                    className="ml-4 p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation(); // impede abrir detalhes
                      handleDelete(analysis.id);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          ))}
      </div>
      <SuccessModal
        open={successModal}
        message="Análise deletada com sucesso!"
        onClose={() => setSuccessModal(false)}
      />
    </div>
  );
};

export default History;
