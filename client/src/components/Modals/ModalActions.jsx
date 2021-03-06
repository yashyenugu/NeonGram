import React, { useState, useContext } from 'react';
import ThumbDownIconFilled from "../Icons/ThumbDownIconFilled";
import ThumbUpIconFilled from "../Icons/ThumbUpIconFilled";
import ThumbDownIcon from "../Icons/ThumbDownIcon";
import ThumbUpIcon from "../Icons/ThumbUpIcon";
import BookMarkIcon from "../Icons/BookMarkIcon";
import PlusIcon from "../Icons/PlusIcon";
import UserIcon from "../Icons/UserIcon";
import DeleteIconSolid from '../Icons/DeleteIconSolid';
import { AuthContext } from "../contextProviders/authContext";
import axiosInstance from "../../config/axios";
import { Formik, Form, Field } from 'formik';
import ButtonSpinner from '../Icons/ButtonSpinner';

const ModalActions = ({ post, addComment, onDelete }) => {


    const { auth } = useContext(AuthContext);

    const [liked, setLiked] = useState(post.likes.includes(auth._id));
    const [disliked, setDisliked] = useState(post.dislikes.includes(auth._id));

    const [numLikes, setNumLikes] = useState(post.likes.length);
    const [numDislikes, setNumDislikes] = useState(post.dislikes.length);
    const [loading, setLoading] = useState(false)

    const handleLiked = (e) => {

        e.preventDefault();

        if (!liked) {

            setLiked(true);
            setNumLikes(prev => prev + 1);


            if (disliked) {
                setDisliked(false);
                setNumDislikes(prev => prev - 1);
            }

            axiosInstance.post(`/api/posts/${post._id}/like`, {})
                .catch(err => {
                    setLiked(false);
                    setNumLikes(prev => prev - 1);

                    setDisliked(true);
                    setNumDislikes(prev => prev + 1);

                })

        } else {

            setLiked(false);
            setNumLikes(prev => prev - 1);

            axiosInstance.post(`/api/posts/${post._id}/removeReaction/likes`, {})
                .catch(err => {
                    setLiked(true);
                    setNumLikes(prev => prev + 1);
                    return;
                })

        }

    }
    const handleDisliked = (e) => {
        e.preventDefault()


        if (!disliked) {

            setDisliked(true);
            setNumDislikes(prev => prev + 1);

            if (liked) {
                setLiked(false);
                setNumLikes(prev => prev - 1);
            }

            axiosInstance.post(`/api/posts/${post._id}/dislike`, {}).catch(err => {

                setDisliked(false);
                setNumDislikes(prev => prev - 1);

                setLiked(true);
                setNumLikes(prev => prev + 1);

                return
            });

        } else {

            setDisliked(false);
            setNumDislikes(prev => prev - 1);
            axiosInstance.post(`/api/posts/${post._id}/removeReaction/dislikes`, {}).catch(err => {

                setDisliked(true);
                setNumDislikes(prev => prev + 1);

                return
            })
        }

    }

    return (
        <>
            <div className="my-2 flex">
                {post.user.profilePicture ? (
                    <img className="w-8 mr-2 rounded-full inline" src={post.user.profilePicture} alt={post.user.username} />
                ) : (
                    <UserIcon className="w-8 mr-2 inline text-gray-200" />
                )}
                <a href={`/user/${post.user.username}`} className="text-gray-200 text-base font-normal">{post.user.username}</a>
                {auth._id === post.user._id && (
                    <button className="text-right ml-auto text-neon-red" onClick={() => {
                        setLoading(true);
                        onDelete(post._id);
                        
                        }}>{loading && <ButtonSpinner className="animate-spin w-6 inline"/> } <DeleteIconSolid className="w-6 inline"/></button>
                )}
                
            </div>
            <div className="text-gray-400 mt-2 mb-8">
                <p>{post.text}</p>
            </div>
            <div className="flex justify-between align-middle mt-2 mb-3">
                <div className="flex">
                    {/* <button onClick={handleLiked} className="mx-2 outline-none w-7 sm:w-8 text-neon-blue">{liked ? <ThumbUpIconFilled className="thumb-up w-7" /> : <ThumbUpIcon className="w-7" />}</button> */}
                    <button onClick={handleLiked} className={`mx-2 outline-none w-7 sm:w-8 text-neon-blue ${!liked && "opacity-50"}`}><ThumbUpIconFilled className="" /></button>
                    <p className="text-neon-blue font-semibold mr-1 relative top-1.5">{numLikes}</p>

                    <button onClick={handleDisliked} className={`mx-2 outline-none w-7 sm:w-8 text-neon-red relative top-0.5 ${!disliked && "opacity-50"}`}><ThumbDownIconFilled className="" /></button>
                    <span className="text-neon-red font-semibold mr-1 relative top-1.5">{numDislikes}</span>


                </div>

                <div>
                    <button className="text-white"><BookMarkIcon className="w-6 sm:w-7 text-white" /></button>

                </div>
                


            </div>
            
            <Formik
                initialValues={{
                    comment: ""
                }}

                validate={values => {
                    const errors = {};
                    if (!values.comment) {
                        errors.comment = 'comment required';
                    }

                    return errors;
                }}

                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true);
                    axiosInstance.post(`/api/comment/add/${post._id}`, {
                        content: values.comment
                    }).then(res => {
                        console.log(values)
                        addComment(values, auth);
                        values.comment = "";
                        })
                    .catch(err => console.log(err));
                    // setComments(prev => [...prev, { content: values.comment, user: { username: auth.username } }]);
                    
                    
                    setSubmitting(false);
                }}

            >

                {({ isSubmitting, isValid, dirty }) => (
                    <Form autoComplete="off" className="flex mb-4">
                        <Field type="text" maxLength="600" name="comment" placeholder="Add a comment..." className="w-full bg-gray-800 rounded-lg mr-2 px-2 py-2 text-base text-gray-300 focus:outline-none" />
                        <button type="submit" disabled={isSubmitting || !(isValid && dirty)} className="w-10 text-neon-green disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? <ButtonSpinner className="animate-spin"/> : <PlusIcon className="" />}</button>
                    </Form>
                )}


            </Formik>
        </>
    )
}

export default ModalActions
