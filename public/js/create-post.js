import { API_BASE_URL } from "./config.js";
import { checkAuthAndRedirect } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {

    const titleInput = document.getElementById("titleInput");
    const contentInput = document.getElementById("contentInput");
    
    const titleHelperText = document.getElementById("titleHelperText");
    const contentHelperText = document.getElementById("contentHelperText");

    const postImageInput = document.getElementById("postWriteImage");
    const createPostBtn = document.getElementById("createPostBtn");

    const TITLE_MAX = 26;


    function validateTitle() {
        if(titleInput.value.trim().length > TITLE_MAX){
            return false;
        }else{
            return true;
        }
    };

    function updateTitleHelperText() {
        if(!validateTitle()){
            titleHelperText.textContent = `* 제목은 ${TITLE_MAX}자를 초과할 수 없습니다.`;
        }else if(titleInput.value.trim().length === 0){
            titleHelperText.textContent = "* 제목을 입력해 주세요.";
        }else {
            titleHelperText.textContent = "";
        };
    };

    function updateContentHelperText() {
        if(contentInput.value.trim().length === 0){
            contentHelperText.textContent = "* 내용을 입력해 주세요.";
        }else {
            contentHelperText.textContent = "";
        };
    };


    function updateCreatePostBtn() {
        if(titleInput.value.trim() != "" && contentInput.value.trim() != "" && validateTitle()){
            createPostBtn.style.backgroundColor = "#7f6aee";
            createPostBtn.disabled = false; //버튼 활성화
        } else{
            createPostBtn.style.backgroundColor = "#aca0eb";
            createPostBtn.disabled = true; //버튼 비활성화 
        }
    };


    async function createPost() {
        const API_URL = `${API_BASE_URL}/posts`;
        const postData = new FormData();
        postData.append('title', titleInput.value.trim());
        postData.append('content', contentInput.value.trim());

        if(postImageInput.files[0]){
            postData.append('postImage', postImageInput.files[0]);
        }

        try{
            const response = await fetch(API_URL, {
                method: "POST",
                credentials: "include",
                body: postData
            });

            if(!response.ok){
                const {message} = await response.json();
                throw new Error(`Error ${response.status}: ${message || 'Unknown error'}`);
            }

            const {data: data} = await response.json();
            const newPostId = data.postId;

            window.location.href = `/posts/${newPostId}`; 

        }catch(error){
            console.error('게시물 작성 실패');
        }
    };


    checkAuthAndRedirect();


    titleInput.addEventListener("input", updateTitleHelperText);
    contentInput.addEventListener("input", updateContentHelperText);

    titleInput.addEventListener("input", updateCreatePostBtn);
    contentInput.addEventListener("input", updateCreatePostBtn);

    createPostBtn.addEventListener("click", createPost);
    
});

