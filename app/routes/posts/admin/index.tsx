import { Link } from "@remix-run/react";

type Props = { isOptimistic?: boolean };
//
export default function AdminIndex(props: Props) {
  return (
    <p>
      {props.isOptimistic ? (
        <span className="text-gray-600 underline hover:cursor-pointer">
          Create a New Post
        </span>
      ) : (
        <Link to="new" className="text-blue-600 underline">
          Create a New Post
        </Link>
      )}
    </p>
  );
}
