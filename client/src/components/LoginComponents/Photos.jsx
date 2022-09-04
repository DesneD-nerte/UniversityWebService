import React from "react";

const endpoint = process.env.REACT_APP_SERVICE_URI;

const Photos = () => {
	return (
		<div className="photos">
			<div className="photos_column column_1">
				<div className="column-image">
					<img
						src={`${endpoint}/images/House.webp`}
						alt="House"
						loading="lazy"
					></img>
				</div>
				<div className="column-image">
					<img
						src={`${endpoint}/images/Sea.webp`}
						alt="Sea"
						loading="lazy"
					></img>
				</div>
			</div>
			<div className="photos_column column_2">
				<div className="column-image">
					<img
						src={`${endpoint}/images/Lighthouse.webp`}
						alt="Lighthouse"
						loading="lazy"
					></img>
				</div>
				<div className="column-image">
					<img
						src={`${endpoint}/images/DarkLandscape.webp`}
						alt="DarkLandscape"
						loading="lazy"
					></img>
				</div>
			</div>
			<div className="photos_column column_3">
				<div className="column-image">
					<img
						src={`${endpoint}/images/Triangles.webp`}
						alt="Triangles"
						loading="lazy"
					></img>
				</div>
				<div className="column-image">
					<img
						src={`${endpoint}/images/BlueSea.webp`}
						alt="BlueSea"
						loading="lazy"
					></img>
				</div>
			</div>
		</div>
	);
};

export default Photos;
