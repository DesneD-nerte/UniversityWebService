import React, {useEffect, useState} from 'react';
import MenuComponent from '../components/MenuComponent';
import { BottomNavigation, Button, CircularProgress, Pagination } from "@mui/material";
import CreateNews from '../components/NewsComponents/CreateNews';
import $api from '../http';
import NewsList from '../components/NewsComponents/NewsList';
import ControlPanel from '../components/NewsComponents/ControlPanel';
import '../styles/NewsPage.css';
import { News } from '../types';
import { useNews } from '../hooks/useNews';

function NewsPage() {

	const [totalPages, setTotalPages] = useState(1);
	const [modal, setModal] = useState(false);
	const [news, setNews] = useState<Array<News>>([]);

	const [limit, setLimit] = useState(5);
	const [page, setPage] = useState(1);

	const [filter, setFilter] = useState({query:''});
	const searchedNews = useNews(news, filter.query);

	const [deleteMode, setDeleteMode] = useState(false);
	const [arrayToDelete, setArrayToDelete] = useState<Array<News>>([]);

	useEffect(() => {
		$api.get('http://localhost:5000/news/getnews')
		.then(response => {
			const ratio = Math.ceil(response.data.length / limit); // 29 / 10 = 3 страницы (2,9)
			setTotalPages(ratio);
		})
		.catch(error => console.log(error))

		$api.get('http://localhost:5000/news/getnews', {params: {limit: limit, page: page}})
		.then(response => {
			setNews(response.data);
		})
		.catch(error => console.log(error))

	}, [page, limit])

	useEffect(() => {
		if(deleteMode) {
			setPage(1);
			setLimit(Number.MAX_SAFE_INTEGER);
		} else {
			setLimit(5);
		}
	}, [deleteMode])

	const createNewNews = (newNews: News) => {
		setNews([...news, newNews]);

		$api.post('http://localhost:5000/news/postnews', {newNews: newNews})
		.then(response => {
			console.log('ok');
		})
		.catch(error => alert('Ошибка загрузки на сервер' + error));

		setModal(false);
	}

	const handleChangePage = (event, newNumberPage) => {
		setPage(newNumberPage);
	}

	return (
		<div className="newsComponent">
			<MenuComponent></MenuComponent>

			<CreateNews visible={modal} setVisible={setModal} createNewNews={createNewNews}></CreateNews>

			<div className='mainContainer'>
				<NewsList news={searchedNews} deleteMode={deleteMode} arrayToDelete={arrayToDelete} setArrayToDelete={setArrayToDelete}></NewsList>

				<div className='separatorColumn'></div>

				<ControlPanel setModal={setModal} filter={filter} setFilter={setFilter} limit={limit} setLimit={setLimit} deleteMode={deleteMode} setDeleteMode={setDeleteMode}></ControlPanel>
			</div>

			<Pagination disabled={modal} style={{paddingTop: 15, paddingBottom: 15}} count={totalPages} page={page} onChange={handleChangePage} color="primary" size="large"></Pagination>
		</div>
	)
}

export default NewsPage