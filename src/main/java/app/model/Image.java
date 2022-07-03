package app.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

import app.model.converter.PositionConverter;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "image")
@NamedQueries({ 
	@NamedQuery(name = "Image.findAll", query = "SELECT i FROM Image i"),
	@NamedQuery(name = "Image.findByImageId", query = "SELECT i FROM image i WHERE i.image_id = :image_id") })

@SuppressWarnings("serial")
public class Image implements Serializable {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id", nullable = false)
    private Integer imageId;
	
	@Column(nullable = false, unique = true)
    private String image_data;

	@Column(length =30, nullable = false, unique = true)
    private String content_type;

	public Integer getImageId() {
		return imageId;
	}

	public void setImageId(Integer imageId) {
		this.imageId = imageId;
	}

	public String getImage_data() {
		return image_data;
	}

	public void setImage_data(String image_data) {
		this.image_data = image_data;
	}

	public String getContent_type() {
		return content_type;
	}

	public void setContent_type(String content_type) {
		this.content_type = content_type;
	}

	@Override
	public int hashCode() {
		return Objects.hash(content_type, imageId);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Image other = (Image) obj;
		return Objects.equals(content_type, other.content_type) && Objects.equals(imageId, other.imageId);
	}

}