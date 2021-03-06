import React, {
    useEffect,
    useState,
    useContext,
    useRef,
} from "react";
import { Pagination } from "@mui/material";
import CreateNews from "../components/NewsComponents/CreateNews";
import { AuthContext } from "../context/authContext";
import NewsList from "../components/NewsComponents/NewsList";
import ControlPanel from "../components/NewsComponents/ControlPanel";
import "../styles/NewsPage.css";
import { News } from "../../types";
import { useNews } from "../hooks/useNews";
import axios from "axios";

const endpoint = process.env.REACT_APP_SERVICE_URI;

function NewsPage() {
    const { authContext } = useContext(AuthContext);

    const [totalPages, setTotalPages] = useState(1);
    const [modal, setModal] = useState(false);
    const [news, setNews] = useState<Array<News>>([]);

    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);
    const previousLimit = useRef(5);

    const [filter, setFilter] = useState({ query: "" });
    const searchedNews = useNews(news, filter.query);

    const [deleteMode, setDeleteMode] = useState(false);
    const [arrayToDelete, setArrayToDelete] = useState<Array<News>>(
        []
    );

    useEffect(() => {
        axios.get(`${endpoint}/news/getnews`).then((response) => {
            const ratio = Math.ceil(response.data.length / limit); // 29 / 10 = 3 страницы
            setTotalPages(ratio);
        });

        axios
            .get(`${endpoint}/news/getnews`, {
                params: { limit: limit, page: page },
            })
            .then((response) => {
                setNews(response.data);
            });
    }, [page, limit]);

    useEffect(() => {
        if (deleteMode) {
            setPage(1);
            setLimit(Number.MAX_SAFE_INTEGER);

            setArrayToDelete([]);
            previousLimit.current = limit;
        } else {
            setLimit(previousLimit.current);
        }
    }, [deleteMode]);

    const createNewNews = (newNews: News) => {
        axios
            .post(`${endpoint}/news/postnews`, {
                data: { newNews: newNews },
            })
            .then((response) => {
                axios
                    .get(`${endpoint}/news/getnews`)
                    .then((response) => {
                        const ratio = Math.ceil(
                            response.data.length / limit
                        ); // 29 / 10 = 3 страницы
                        setTotalPages(ratio);
                    })
                    .catch((error) => console.log(error));

                axios
                    .get(`${endpoint}/news/getnews`, {
                        params: { limit: limit, page: page },
                    })
                    .then((response) => {
                        setNews(response.data);
                    });
            })
            .catch((error) =>
                alert("Ошибка загрузки на сервер" + error)
            );

        setModal(false);
    };

    const handleChangePage = (event, newNumberPage) => {
        setPage(newNumberPage);
    };

    return (
        <div className="newsComponent">
            <CreateNews
                visible={modal}
                setVisible={setModal}
                createNewNews={createNewNews}
            ></CreateNews>

            <div className="mainContainer">
                <div className="flexContainer">
                    <div className="newsContainer">
                        <NewsList
                            news={searchedNews}
                            deleteMode={deleteMode}
                            arrayToDelete={arrayToDelete}
                            setArrayToDelete={setArrayToDelete}
                        />

                        {/* <div className='separatorColumn'></div> */}

                        <ControlPanel
                            arrayToDelete={arrayToDelete}
                            setModal={setModal}
                            filter={filter}
                            setFilter={setFilter}
                            limit={limit}
                            setLimit={setLimit}
                            deleteMode={deleteMode}
                            setDeleteMode={setDeleteMode}
                        />
                    </div>

                    <Pagination
                        disabled={modal}
                        style={{ paddingTop: 15, paddingBottom: 15 }}
                        count={totalPages}
                        page={page}
                        onChange={handleChangePage}
                        color="primary"
                        size="large"
                    />
                </div>
            </div>
        </div>
    );
}

export default NewsPage;
