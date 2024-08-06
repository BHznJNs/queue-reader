use reqwest;
use unicode_segmentation::UnicodeSegmentation;
use scraper::{ElementRef, Html, Selector};
use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ArticleInfo {
    title: String,
    link: String,
    description: Option<String>,
    needed_time: usize,
}

#[tauri::command]
pub async fn fetch_article(url: &str) -> Result<ArticleInfo, ()> {
    const READING_FACTOR: usize = 250;

    let html = reqwest::get(url)
        .await.map_err(|_| ())?
        .text()
        .await.map_err(|_| ())?;
    let document = Html::parse_document(&html);

    let title_selector = Selector::parse("title").unwrap();
    let description_selector = Selector::parse("meta[name=description]").unwrap();
    let content_selector =
        Selector::parse(&vec!["h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "dl"].join(","))
            .unwrap();

    let mut title_iter = document.select(&title_selector);
    let mut description_iter = document.select(&description_selector);
    let content_iter = document.select(&content_selector);

    let title = title_iter
        .next().ok_or(())?
        .inner_html();
    let description = match description_iter.next() {
        Some(desc) if desc.value().attr("content").is_some() => {
            let desc_str = desc.value().attr("content").unwrap().to_string();
            Some(desc_str)
        }
        _ => None,
    };

    let get_text_content = |el: ElementRef| el.text().collect::<Vec<_>>().join(" ");
    let counter = |content: String| content.split_word_bounds().count();
    let word_count = content_iter
        .map(get_text_content)
        .map(counter)
        .sum::<usize>();
    let needed_time = word_count / READING_FACTOR;

    return Ok(ArticleInfo {
        title,
        link: url.to_string(),
        description,
        needed_time,
    });
}
