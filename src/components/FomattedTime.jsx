/** @format */

const FormattedTime = ({ studentResult }) => {
	const convertSecondsToMinutesAndSeconds = totalSeconds => {
		const minutes = Math.floor(totalSeconds / 60)
		const seconds = totalSeconds % 60
		return `${minutes} мин ${seconds} сек`
	}
	const formattedTime = convertSecondsToMinutesAndSeconds(
		studentResult.total_time_spent
	)

	return <p>{formattedTime}</p>
}

export default FormattedTime
