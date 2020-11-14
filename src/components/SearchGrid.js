import React, { useState, useEffect} from 'react';
import {Button, Form, FormGroup, Input, Modal, ModalHeader, ModalBody} from "reactstrap";
import Unsplash, {toJson} from "unsplash-js";
import StackGrid from "react-stack-grid";

const SearchGrid = () => {
	const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("Photo");
    const [pics, setPics] = useState([]);
    const [queryEntered, setQueryEntered] = useState("Photo");
    const [isModalOpen, setIsModelOpen] = useState(false);
    const [currIndex, setCurrIndex] = useState(0);    
    const [currImgUrl, setCurrImgUrl] = useState("");
    const [currAlt, setCurrAlt] = useState("");

    const unsplash = new Unsplash({
        accessKey: "TaThSuyp7KR4cz7LLmi_XEAAxsb-OXuz3ATnuL9QE0Y",
    });
    

	useEffect(() => {
		fetchData();
		window.addEventListener('scroll', handleScroll);
	}, []);

	const handleScroll = () => {
		if (
			Math.ceil(window.innerHeight + document.documentElement.scrollTop) !== document.documentElement.offsetHeight ||
			isFetching
		)
			return;
		setIsFetching(true);
		console.log(isFetching);
	};

	const fetchData = async () => {
        
        unsplash.search
                .photos(query, page, 20)
                .then(toJson)
                .then((json) => {
                    setPics([...pics, ...json.results]);
                    setPage(page+1);
            });
	};  

	useEffect(() => {
		if (!isFetching) return;
		fetchMoreListItems();
    }, [isFetching]);
    
    useEffect(() => {
        if(pics.length != 0)
            return;
        fetchData();
    },[pics, query, page]);

	const fetchMoreListItems = () => {
		fetchData();
		setIsFetching(false);
    };
    
    const handleInputChange = (e) => {
        setQueryEntered(e.target.value);
    }

    const fetchNewData = (e) => {

        e.preventDefault();

        setPics([]);
        setPage(1);
        setQuery(queryEntered);
        setIsFetching(false);

    }

    const viewImg = (picId) => {
        console.log(picId);
        setCurrIndex(picId);
        setCurrImgUrl(pics[picId].urls.full);
        setCurrAlt(pics[picId].alt_description);
        setIsModelOpen(true);
        
    }

    const prevImg = () => {
        var prevId = Math.max(0,currIndex - 1);
        setCurrImgUrl(pics[prevId].urls.full);
        setCurrAlt(pics[prevId].alt_description);
        setCurrIndex(prevId);
    }


    const nextImg = () => {
        var nextId = Math.min(pics.length, currIndex + 1);
        setCurrImgUrl(pics[nextId].urls.full);
        setCurrAlt(pics[nextId].alt_description);
        setCurrIndex(nextId);
    }

	return (
		<div>
            <Modal isOpen={isModalOpen} toggle={() => {setIsModelOpen(!isModalOpen)}}>
                <ModalHeader toggle={() => {setIsModelOpen(!isModalOpen)}}>{currAlt}</ModalHeader>
                <ModalBody>
                    <div>
                        <img width="10%" 
                                src="assets/left-arrow.png"
                                onClick={() => {prevImg()}}></img>
                        <img className="grid-img"
                                alt={currAlt}
                                src={currImgUrl}
                                width="80%"
                        ></img>
                        <img width="10%" 
                                src="assets/right-arrow.png"
                                onClick={() => {nextImg()}}></img>
                    </div>
                </ModalBody>
            </Modal>

            <Form onSubmit={fetchNewData} className="container">
                <FormGroup className="row align-items-center search-form">
                    <div className="col-12">
                        <Input type="text" name="query" id="query" 
                            placeholder="Search for a photo" 
                            onChange={handleInputChange}/>
                    </div>
                    <div className="ml-auto mr-auto align-items-center search-form">
                        <Button type="submit"> Search</Button>
                    </div>
                </FormGroup>
            </Form>

            <StackGrid className="grids" columnWidth={250} >
                {pics.map((pic, index) => (
                    <div key={index}>
                        <img className="grid-img"
                            alt={pic.alt_description}
                            src={pic.urls.full}
                            width="90%"
                            onClick = {() => {viewImg(index)}}
                        ></img>
                    </div>
                ))}
            </StackGrid>
            
            {isFetching && <h1>Fetching more list items...</h1>}
        </div>
	);
};

export default SearchGrid;