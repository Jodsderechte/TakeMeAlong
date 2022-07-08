package app.api.dto;

import java.io.Serializable;

@SuppressWarnings("serial")
public class ImageDto implements Serializable
{ 
	byte[] ImageData;
	String contentType;
	
	
	
	public byte[] getImageData() {
		return ImageData;
	}



	public void setImageData(byte[] imageData) {
		ImageData = imageData;
	}



	public String getContetyType() {
		return contentType;
	}



	public void setContetyType(String contetyType) {
		this.contentType = contetyType;
	}



	@Override
	public String toString() {
		return "ImageDto [ImageData=" + ImageData + ", contetyType=" + contentType + "]";
	}



	
	
	
}
