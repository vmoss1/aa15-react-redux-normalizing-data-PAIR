// import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const LOAD_ARTICLES = "article/loadArticles";
const ADD_ARTICLE = "article/addArticle";

export const loadArticles = (articles) => {
  return {
    type: LOAD_ARTICLES,
    articles,
  };
};

export const addArticle = (article) => {
  return {
    type: ADD_ARTICLE,
    article,
  };
};

export const fetchArticles = () => async (dispatch) => {
  const response = await fetch("/api/articles");
  const articles = await response.json();
  dispatch(loadArticles(articles));
};

export const writeArticle = (payload) => async (dispatch) => {
  const response = await fetch("/api/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const article = await response.json();
    dispatch(addArticle(article));
    return article;
  }
};

const selectArticles = (state) => state.articleState.entries;

export const selectArticlesArray = createSelector(
  selectArticles,
  (articles) => {
    return Object.values(articles);
  }
);

export const selectArticleById = (id) => (state) =>
  state.articleState.entries[id];

const initialState = { entries: {}, isLoading: true };

const articleReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ARTICLES: {
      const newObj = {};
      action.articles.forEach((ele) => (newObj[ele.id] = { ...ele }));
      return { ...state, entries: { ...newObj } };
    }
    case ADD_ARTICLE: {
      const newArticle = {};
      newArticle[action.article.id] = action.article;
      return { ...state, entries: { ...state.entries, ...newArticle } };
    }
    default:
      return state;
  }
};

export default articleReducer;
