import React from "react";
import styles from "./styles/chapterCard.module.scss";
import LinkButton from "../Common/Buttons/LinkButton";
import HighLightBadge from "../Common/CardElements/HighLightBadge";
import ChapterIcon from "../Common/Icons/ChapterIcon";
import ClockIcon from "../Common/Icons/ClockIcon";
import { convertMinutesToHours } from "@/lib/utils/durationConvert";
import { generateSlug } from "@/lib/utils/slugUtil";
import TopicIcon from "../Common/Icons/TopicIcon";

const TopicsListItem = ({ topic, index }) => {
  return (
    <div className={styles.topicItemWrapper}>
      <div
        className={styles.topicItemWrapper__bulletElement}
        style={{ opacity: 1 - index * 0.3 }}
      >
        <div className={styles.lineDiv}></div>
      </div>
      <div
        className={styles.topicItemWrapper__textDiv}
        style={{ opacity: 1 - index * 0.3 }}
      >
        <p>{topic.title}</p>
      </div>
    </div>
  );
};
const ChapterCard = ({ chapter, index, searchParams }) => {
  const { item: searchedItemId } = searchParams || undefined;
  return (
    <div
      className={`${styles.card} ${
        searchedItemId &&
        searchedItemId === chapter._id &&
        styles["card--searchedItem"]
      }`}
    >
      <div className={styles.card__chapterNumWrapper}>
        <div>
          <p>
            {index <= 9 ? " 0" + (index + 1) : index + 1}
            <span>.</span>
          </p>
        </div>
      </div>
      <div className={styles.card__bookmarkIconWrapper}></div>
      <div className={styles.card__titleWrapper}>
        <p>{chapter.title}</p>
      </div>
      <div className={styles.card__topicsListWrapper}>
        <div className={styles.listInnerWrapper}>
          {chapter && chapter.topics && chapter.topics.length > 0 ? (
            chapter.topics.map((topic, index) => (
              <TopicsListItem key={topic._id} topic={topic} index={index} />
            ))
          ) : (
            <TopicsListItem key={"0"} topic={{ title: "No Topics" }} />
          )}
        </div>
      </div>
      <div className={styles.card__topicsCountWrapper}>
        <HighLightBadge
          IconComponent={TopicIcon}
          text={`${chapter.topicsCount} Topics`}
          isHighlighted={true}
        />
      </div>
      <div className={styles.card__durationWrapper}>
        <HighLightBadge
          IconComponent={ClockIcon}
          text={convertMinutesToHours(chapter.duration)}
          isHighlighted={false}
        />
      </div>
      <div className={styles.card__linkBtnWrapper}>
        <div className={styles.buttonWrapper}>
          <LinkButton
            to={`chapters/${chapter.slug}/${chapter._id}/topic/${chapter.topics[0].slug}/${chapter.topics[0]._id}`}
            linkProps={{
              chapterId: chapter._id,
              chapterName: chapter.title,
              topicId: chapter.topics[0]._id,
              topicName: chapter.topics[0].title,
              topicsCount: chapter.topicsCount,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;
