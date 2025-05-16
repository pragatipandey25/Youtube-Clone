import React, { useEffect, useState } from 'react'
import './Feed.css'
import { Link } from 'react-router-dom'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'

const Feed = ({ category }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null); // State to manage errors

    const fetchData = async () => {
        const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
        try {
            const response = await fetch(videoList_url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.items) {
                setData(data.items);
            } else {
                setError('No data found for this category.');
            }
        } catch (error) {
            setError('Failed to fetch data: ' + error.message);
        }
    }

    useEffect(() => {
        fetchData();
    }, [category])

    return (
        <div className="feed">
            {error && <div className="error-message">{error}</div>} {/* Display error message */}
            {data.map((item, index) => {
                return (
                    <Link to={`video/${item.snippet.categoryId}/${item.id}`} className='card' key={index}>
                        <img src={item.snippet.thumbnails.medium.url} alt="" />
                        <h2>{item.snippet.title}</h2>
                        <h3>{item.snippet.channelTitle}</h3>
                        <p>{value_converter(item.statistics.viewCount)} Views &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
                    </Link>
                )
            })}
        </div>
    )
}

export default Feed;
