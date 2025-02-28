import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import GenericTable from "../../components/common/table/GenericTable";
import {
  fetchUserFreeModeProgress,
  createUserFreeModeProgress,
  setActiveFreeModeProgress,
} from "../../features/user/userSlice";
import Header from "../../components/common/header/Header";
import htmlIcon from "../../assets/icons/html.svg";
import cssIcon from "../../assets/icons/css.svg";
import jsIcon from "../../assets/icons/js.svg";
import left from "../../assets/icons/corchete-izquierdo.svg";
import right from "../../assets/icons/corchete-derecho.svg";
import GenericDialog from "../../components/common/dialog/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../LoadingPage";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../../components/common/input/Input";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35m1.26-5.34A7.5 7.5 0 1111.41 4.59a7.5 7.5 0 016.5 6.5zm0 0A7.5 7.5 0 0117.91 7.91z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const FreeCodeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const freeModeProgressList = useSelector(
    (state) => state.user.freeModeProgressList
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = useCallback(
    debounce((name) => {
      setDebouncedSearchTerm(name);
    }, 500),
    []
  );

  useEffect(() => {
    fetchData(page);
  }, [dispatch, debouncedSearchTerm]);

  const fetchData = async (currentPage) => {
    const query = {
      limit: 5,
      page: currentPage,
      sortBy: "updatedAt:desc",
      name: debouncedSearchTerm,
    };
    await dispatch(fetchUserFreeModeProgress({ query }));

    setLoading(false);
  };

  useEffect(() => {
    if (freeModeProgressList) {
      setTotalPages(freeModeProgressList.totalPages);
    }
  }, [freeModeProgressList]);

  const columns = [
    { header: "Nombre de proyecto", accessor: "name" },
    { header: "Última modificación", accessor: "updatedAt", type: "date" },
    { header: "Tipo de archivo", accessor: "examId", type: "proyectType" },
  ];

  const navigateToProject = async (row) => {
    await dispatch(setActiveFreeModeProgress(row));

    const url = row.examId
      ? `/editor/${row.id}?examId=${row.examId}`
      : `/editor/${row.id}`;

    navigate(url);
  };

  const actions = [
    {
      label: "Ir al proyecto",
      color: "blue",
      onClick: navigateToProject,
    },
  ];

  const handleCreateProject = async () => {
    await dispatch(createUserFreeModeProgress({ body: { name } }));
    toast.success("Proyecto creado exitosamente");
    setOpenDialog(false);
    await fetchData(page);
  };

  const handlePageChange = async (next) => {
    setPage(next);
    await fetchData(next);
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Header />
      <div className="p-6 h-[90vh] bg-[#141F25] text-white">
        <div className="flex flex-col items-center">
          <div>
            <h1 className="text-6xl flex items-center space-x-2 mt-32 mb-4">
              <img src={left} alt="Corchete izquierdo" className="h-10" />
              <span>Tus proyectos</span>
              <img src={right} alt="Corchete derecho" className="h-10" />
            </h1>
          </div>
          <div
            className="flex flex-col items-center mt-8 border-2 rounded-lg"
            style={{ borderColor: "#365A68" }}
          >
            <div className="flex justify-between w-full  p-4">
              <div className="flex items-center bg-gray-800 p-2 rounded-lg">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Buscar proyecto"
                  className="bg-transparent outline-none text-white ml-2"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
              </div>
              <button
                className="flex items-center gap-2 bg-[#E0F47E] text-black px-4 py-2 rounded-lg hover:bg-[#CDEA3D]"
                onClick={() => setOpenDialog(true)}
              >
                <PlusIcon />
                Nuevo proyecto
              </button>
            </div>
            <GenericTable
              data={freeModeProgressList.results}
              columns={columns}
              actions={actions}
              minWidth={800}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isDarkBackground={true}
            />
          </div>
        </div>
      </div>
      {openDialog && (
        <GenericDialog
          type="form"
          title={"Crear nuevo proyecto"}
          inputs={[
            {
              placeholder: "Ingresa el nombre",
              type: "text",
              value: name,
              onChange: (e) => setName(e.target.value),
            },
          ]}
          confirmButtonText={"Enviar"}
          cancelButtonText={"Cancelar"}
          onCancel={() => setOpenDialog(false)}
          onConfirm={handleCreateProject}
        />
      )}
    </div>
  );
};

export default FreeCodeList;
