import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiServices from "../services/api";

const AnalysisDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiServices.analysisService.getAnalysisResults(id);
        setAnalysis(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const parseCSV = (csv) => {
    const cleaned = csv.replace("```csv", "").replace("```", "").trim();
    const lines = cleaned.split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map((l) => l.split(","));
    return { headers, rows };
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Carregando análise...
      </div>
    );
  }

  if (!analysis) {
    return <div className="p-10 text-center">Análise não encontrada.</div>;
  }

  const a = analysis.analysis;

  const { headers, rows } = parseCSV(a.rawContent);

  // Remove bug das linhas "```csv" e "```"
  const cleanPending = a.pendingSubjects.filter(
    (p) => !p.name.includes("```")
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalhes da Análise</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
        >
          Voltar
        </button>
      </div>

      {/* Cards Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white shadow p-5 rounded-lg">
          <p className="text-sm text-gray-600">Equivalentes</p>
          <h2 className="text-3xl font-semibold text-green-700">
            {a.equivalentCount}
          </h2>
        </div>

        <div className="bg-white shadow p-5 rounded-lg">
          <p className="text-sm text-gray-600">Pendentes</p>
          <h2 className="text-3xl font-semibold text-yellow-600">
            {a.pendingCount}
          </h2>
        </div>

        <div className="bg-white shadow p-5 rounded-lg">
          <p className="text-sm text-gray-600">Carga Horária Total</p>
          <h2 className="text-3xl font-semibold text-blue-700">
            {a.workloadCount}h
          </h2>
        </div>

      </div>

      {/* Informações do Aluno */}
      <div className="bg-white shadow p-6 rounded-lg space-y-3">
        <h2 className="text-lg font-semibold">Dados do Aluno</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Nome:</strong> {analysis.studentName}</p>
          <p><strong>Matrícula:</strong> {analysis.registration}</p>
          <p><strong>Curso Atual:</strong> {analysis.studentActualCourse}</p>
          <p><strong>Curso Para:</strong> {analysis.studentTargetCourse}</p>
        </div>
      </div>

      {/* Gerador */}
      <div className="bg-white shadow p-6 rounded-lg space-y-3">
        <h2 className="text-lg font-semibold">Gerada por</h2>

        <p><strong>Nome:</strong> {analysis.generator.name}</p>
        <p><strong>Email:</strong> {analysis.generator.email}</p>
        <p><strong>Criada em:</strong> {formatDate(analysis.createdAt)}</p>
        <p><strong>Atualizada em:</strong> {formatDate(analysis.updatedAt)}</p>
      </div>

      {/* Equivalentes */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Disciplinas Equivalentes</h2>

        <div className="overflow-auto max-h-96 border rounded">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-green-100 text-green-900">
              <tr>
                <th className="px-4 py-2 border">Disciplina</th>
                <th className="px-4 py-2 border">Carga</th>
                <th className="px-4 py-2 border">Equivalente a</th>
              </tr>
            </thead>
            <tbody>
              {a.equivalentSubjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-green-50">
                  <td className="px-4 py-2 border">{sub.name}</td>
                  <td className="px-4 py-2 border">{sub.workload}h</td>
                  <td className="px-4 py-2 border">
                    {sub.equivalentTo || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pendentes */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Disciplinas Pendentes</h2>

        <div className="overflow-auto max-h-96 border rounded">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-yellow-100 text-yellow-900">
              <tr>
                <th className="px-4 py-2 border">Disciplina</th>
                <th className="px-4 py-2 border">Carga</th>
              </tr>
            </thead>
            <tbody>
              {cleanPending.map((sub, idx) => (
                <tr key={idx} className="hover:bg-yellow-50">
                  <td className="px-4 py-2 border">{sub.name}</td>
                  <td className="px-4 py-2 border">{sub.workload}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conteúdo Original */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Conteúdo Original (CSV)</h2>

        <div className="overflow-auto max-h-96 border rounded">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-2 border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {row.map((cell, i) => (
                    <td key={i} className="px-4 py-2 border">
                      {cell || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AnalysisDetails;
