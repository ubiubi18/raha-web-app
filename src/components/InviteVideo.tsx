import * as classnames from "classnames";
import * as React from "react";
import { getPrivateVideoInviteRef } from "../connectors";
import { storageRef } from "../firebaseInit";
import Loading from "./Loading";
import Video from "./Video";

interface Props {
  readonly memberId: string;
  readonly className?: string;
}

const InviteVideo: React.StatelessComponent<Props> = ({memberId, className}) => {
  // TODO group by uid instead of mid?
  const videoUrl = `https://storage.googleapis.com/raha-video/${memberId}/invite.mp4`
  return (
    <Video className={className} videoUrl={videoUrl} />
  );
}
export default InviteVideo;