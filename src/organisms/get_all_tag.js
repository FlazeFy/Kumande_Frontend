import React from 'react'
import { useState, useEffect } from "react"
import ComponentBreakLine from '../atoms/breakline'
import ComponentTextForm from '../atoms/text_form'
import { getLocal } from '../modules/storages/local'
import ComponentAlertBox from '../molecules/alert_box'

export default function ComponentGetAllTag({url, cls, func}) {
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
    })

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
        return <ComponentAlertBox message={error.message} type='danger' context={'get all tag'}/>
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
                                if(selectedTag.length === 0){
                                    func(val['tags_slug'])
                                    selectTag(i, val['tags_slug'], val['tags_name'])
                                } else {
                                    let found = false
                                    selectedTag.map((slct, j, index) => {
                                        if(slct.props.value === val['tags_slug']){
                                            found = true
                                        }
                                        return null
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
                <ComponentTextForm text_type="form_label" body="Selected Tag"/>
                <ComponentBreakLine length={1}/>
                <div className="mt-2"/>
                {selectedTag}
            </>
        )
    }
}