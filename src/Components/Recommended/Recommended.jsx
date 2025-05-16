import React, { useEffect, useState } from 'react'
import './Recommended.css'
import {API_KEY, value_converter} from '../../data'
import {Link} from 'react-router-dom'

const Recommended = ({ categoryId }) => {
    const [apiData, setApiData] = useState([]);
    const [error, setError] = useState(null); // State to manage errors

    const fetchData = async () => {
        const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
        console.log('Fetching data from:', relatedVideo_url); // Log the URL being fetched
        try {
            const response = await fetch(relatedVideo_url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('API Response:', data); // Log the API response
            if (data.items) {
                setApiData(data.items);
            } else {
                setError('No recommended videos found for this category.');
            }
        } catch (error) {
            setError('Failed to fetch data: ' + error.message);
        }
    }

    useEffect(() => {
        fetchData();
    }, [categoryId]) // Fetch data when categoryId changes

    return (
        <div className='recommended'>
            {error && <div className="error-message">{error}</div>} {/* Display error message */}
            {apiData.map((item, index) => {
                return (
                    <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className="side-video-list">
                        <img src={item.snippet.thumbnails.medium.url} alt="" />
                        <div className="vid-info">
                            <h4>{item.snippet.title}</h4>
                            <p>{item.snippet.channelTitle}</p>
                            <p>{value_converter(item.statistics.viewCount)} Views</p>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Recommended;
