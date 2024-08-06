import React from 'react'
import { useState, useEffect } from "react"
import ComponentBreakLine from '../../atoms/breakline'

// Modules
import { getLocal } from '../../modules/storages/local'
import GetLabel from '../labels/label'

export default function GetAllTag({url, cls, func}) {
    //Initial variable
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const [selectedTag, setSelectedTag] = useState([])

    useEffect(() => {
        //Default config
        const keyPage = sessionStorage.getItem("List_Tag")

        if(keyPage == null){
            sessionStorage.setItem("List_Tag", "1");
        }

        fetch(url)
        .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true)
                setItems(result.data.data)        
            },
            (error) => {
                if(getLocal("List_Tag_sess") !== undefined){
                    setIsLoaded(true)
                    setItems(JSON.parse(getLocal("List_Tag_sess")))
                } else {
                    setIsLoaded(true)
                    setError(error)
                }
            }
        )
    },[])

    const removeTag = (slug) => {        
        let updatedTags = selectedTag.filter((val, i) => val.props.value !== slug)

        setSelectedTag(updatedTags)
    }

    const selectTag = (i, slug, name) => {
        setSelectedTag(selectedTag.concat(
            <button key={i} className={cls} value={slug} title="Unselect this tag" onClick={(e) => removeTag(slug)}>{name}</button>
        ))
    }

    if (error) {
        return <div><h2>Failed to fetch</h2> Error: {error.message}</div>
    } else if (!isLoaded) {
        return (
            <div>
                <h5 className='text-center text-white mt-2 fst-italic'>Loading...</h5>
            </div>
        )
    } else {
        return (
            <> 
                {
                    items.map((val, i, index) => {
                        return (
                            <button key={i} title="Select this tag" className={cls} onClick={() => {
                                if(selectedTag.length == 0){
                                    func(val['tags_slug'])
                                    selectTag(i, val['tags_slug'], val['tags_name'])
                                } else {
                                    let found = false
                                    selectedTag.map((slct, j, index) => {
                                        if(slct.props.value == val['tags_slug']){
                                            found = true
                                        }
                                    })

                                    if(!found){
                                        selectTag(i, val['tags_slug'], val['tags_name'])
                                    }
                                }
                            }} >{val['tags_name']}</button>
                        );
                    })
                }
                <ComponentBreakLine length={2}/>
                <GetLabel title="Selected Tag" type="input"/>
                <ComponentBreakLine length={1}/>
                <div className="mt-2"/>
                {selectedTag}
            </>
        )
    }
}